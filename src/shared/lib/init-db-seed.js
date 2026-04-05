import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { prisma } from '@/shared/lib/prisma';

const DATA_DIR = path.join(process.cwd(), 'data');

const REQUIRED_SQL_FILES = [
  'categories_rows.sql',
  'products_rows.sql',
  'landing_pages_rows.sql',
  'profiles_rows.sql',
];

function fileExists(relPath) {
  const p = path.join(DATA_DIR, relPath);
  return fs.existsSync(p) ? p : null;
}

/** Цена в дампе Supabase часто как '46.00' перед URL картинки — приводим к INTEGER. */
export function fixProductPricesInInsertSql(sql) {
  let s = sql.replace(
    /,\s*'([0-9]+(?:\.[0-9]+)?)'\s*,\s*'(https?:\/\/|\/images\/|\/uploads\/)/g,
    (_, price, imgStart) => `, ${Math.round(Number(price))}, '${imgStart}`
  );
  s = s.replace(/,\s*'\[\]'\s*,/g, ', \'{}\', ');
  return s;
}

/**
 * В дампах Supabase внутри JSON-литералов в SQL часто пишут `\\"`; при standard_conforming_strings
 * в строке остаётся два `\` перед `"`, и json/jsonb становится невалидным (например «Саундбар» в benefits).
 */
export function fixSupabaseJsonQuotesInSqlText(sql) {
  return sql.replace(/\\\\"/g, '\\"');
}

function parseSqlScalarToken(token) {
  const t = token.trim();
  if (t === 'null') return null;
  if (t.startsWith('\'') && t.endsWith('\'')) {
    return t.slice(1, -1).replace(/''/g, '\'');
  }
  return t;
}

function defaultCategoryNameFromId(id) {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/** Создаёт недостающие categories по всем category_id из products_rows (FK), например infinix, huawei. */
async function ensureCategoriesReferencedByProducts(productsSql) {
  const valuesSql = extractInsertValuesSection(productsSql);
  const tupleStrings = splitSqlTuples(valuesSql);
  const ids = new Set();
  for (const tuple of tupleStrings) {
    const vals = splitSqlRowValues(tuple);
    if (vals.length < 4) continue;
    const cid = parseSqlScalarToken(vals[3]);
    if (cid) ids.add(cid);
  }
  for (const id of ids) {
    const name = defaultCategoryNameFromId(id) || id;
    await prisma.category.upsert({
      where: { id },
      create: { id, name, image: null, description: null },
      update: {},
    });
  }
}

function extractInsertValuesSection(sql) {
  const m = sql.match(/\)\s*VALUES\s+/i);
  if (!m || m.index === undefined) {
    throw new Error('Не найден фрагмент ) VALUES ');
  }
  let i = m.index + m[0].length;
  while (i < sql.length && /\s/.test(sql[i])) i++;
  let valuesSql = sql.slice(i).trim();
  if (valuesSql.endsWith(';')) valuesSql = valuesSql.slice(0, -1).trim();
  return valuesSql;
}

/** Разбить верхний уровень кортежей `(..), (..)` с учётом строк в кавычках. */
export function splitSqlTuples(valuesSql) {
  const rows = [];
  let i = 0;
  const s = valuesSql.trim();
  while (i < s.length) {
    while (i < s.length && (/\s/.test(s[i]) || s[i] === ',')) i++;
    if (i >= s.length) break;
    if (s[i] !== '(') {
      throw new Error(`Ожидалась '(' в позиции ${i}`);
    }
    let depth = 0;
    let inQuote = false;
    const start = i;
    for (; i < s.length; i++) {
      const c = s[i];
      if (inQuote) {
        if (c === '\'' && s[i + 1] === '\'') {
          i++;
          continue;
        }
        if (c === '\'') inQuote = false;
        continue;
      }
      if (c === '\'') {
        inQuote = true;
        continue;
      }
      if (c === '(') depth++;
      else if (c === ')') {
        depth--;
        if (depth === 0) {
          i++;
          rows.push(s.slice(start, i));
          break;
        }
      }
    }
    if (depth !== 0) {
      throw new Error('Несбалансированные скобки в VALUES');
    }
  }
  return rows;
}

/** Поля одной строки INSERT, разделённые запятыми на верхнем уровне (внутри '…' запятые игнорируются). */
export function splitSqlRowValues(rowInner) {
  const inner = rowInner.startsWith('(') && rowInner.endsWith(')')
    ? rowInner.slice(1, -1)
    : rowInner;
  const parts = [];
  let i = 0;
  let cur = '';
  let inQuote = false;
  const len = inner.length;
  while (i < len) {
    const c = inner[i];
    if (inQuote) {
      cur += c;
      if (c === '\'' && inner[i + 1] === '\'') {
        cur += inner[i + 1];
        i += 2;
        continue;
      }
      if (c === '\'') inQuote = false;
      i++;
      continue;
    }
    if (c === '\'') {
      inQuote = true;
      cur += c;
      i++;
      continue;
    }
    if (c === ',') {
      parts.push(cur.trim());
      cur = '';
      i++;
      continue;
    }
    cur += c;
    i++;
  }
  if (cur.trim().length > 0) parts.push(cur.trim());
  return parts;
}

/** Дамп Supabase: 21 колонка; в приложении нет theme, content, images — выкидываем и переупорядочиваем. */
const LANDING_SUPABASE_FIELD_COUNT = 21;

export function transformSupabaseLandingPagesInsertSql(sql) {
  const valuesSql = extractInsertValuesSection(sql);
  const tupleStrings = splitSqlTuples(valuesSql);
  const cols =
    '("id", "slug", "title", "main_title", "description", "main_image", "secondary_image", "benefits", "advantages", "reviews", "pixels", "button_text", "survey_text", "colors", "styles", "is_active", "created_at", "updated_at")';
  const newTuples = [];
  for (const tuple of tupleStrings) {
    const vals = splitSqlRowValues(tuple);
    if (vals.length !== LANDING_SUPABASE_FIELD_COUNT) {
      throw new Error(
        `landing_pages: ожидалось ${LANDING_SUPABASE_FIELD_COUNT} полей в строке, получено ${vals.length}`
      );
    }
    const out = [
      vals[0],
      vals[1],
      vals[2],
      vals[15],
      vals[16],
      vals[17],
      vals[18],
      vals[12],
      vals[10],
      vals[11],
      vals[6],
      vals[19],
      vals[20],
      vals[13],
      vals[14],
      vals[7],
      vals[8],
      vals[9],
    ];
    newTuples.push(`(${out.join(', ')})`);
  }
  return fixSupabaseJsonQuotesInSqlText(
    `INSERT INTO "public"."landing_pages" ${cols} VALUES ${newTuples.join(', ')}`
  );
}

const PROFILES_FIELD_COUNT = 6;

export function buildUsersInsertFromProfilesSql(sql, passwordHash) {
  const escapedHash = passwordHash.replace(/'/g, '\'\'');
  const hashLit = `'${escapedHash}'`;
  const valuesSql = extractInsertValuesSection(sql);
  const tupleStrings = splitSqlTuples(valuesSql);
  const newTuples = [];
  for (const tuple of tupleStrings) {
    const vals = splitSqlRowValues(tuple);
    if (vals.length !== PROFILES_FIELD_COUNT) {
      throw new Error(
        `profiles: ожидалось ${PROFILES_FIELD_COUNT} полей в строке, получено ${vals.length}`
      );
    }
    const out = [vals[0], vals[1], hashLit, vals[2], vals[3], vals[4], vals[5]];
    newTuples.push(`(${out.join(', ')})`);
  }
  return `INSERT INTO "public"."users" ("id", "email", "password_hash", "full_name", "role", "created_at", "updated_at") VALUES ${newTuples.join(', ')}`;
}

function appendCategoriesOnConflictUpsert(sql) {
  const t = sql.trim().replace(/;\s*$/, '');
  if (/on\s+conflict/i.test(t)) return `${t};`;
  return `${t} ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "image" = EXCLUDED."image",
  "description" = EXCLUDED."description",
  "updated_at" = EXCLUDED."updated_at";`;
}

function appendProductsOnConflictUpsert(sql) {
  const t = sql.trim().replace(/;\s*$/, '');
  if (/on\s+conflict/i.test(t)) return `${t};`;
  return `${t} ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "category_id" = EXCLUDED."category_id",
  "price" = EXCLUDED."price",
  "image" = EXCLUDED."image",
  "images" = EXCLUDED."images",
  "description" = EXCLUDED."description",
  "specifications" = EXCLUDED."specifications",
  "updated_at" = EXCLUDED."updated_at";`;
}

function appendLandingsOnConflictUpsert(sql) {
  const t = sql.trim().replace(/;\s*$/, '');
  if (/on\s+conflict/i.test(t)) return `${t};`;
  /* По slug: если в БД уже есть тот же slug с другим id, конфликт по id не сработает — падала уникальность slug. */
  return `${t} ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "main_title" = EXCLUDED."main_title",
  "description" = EXCLUDED."description",
  "main_image" = EXCLUDED."main_image",
  "secondary_image" = EXCLUDED."secondary_image",
  "benefits" = EXCLUDED."benefits",
  "advantages" = EXCLUDED."advantages",
  "reviews" = EXCLUDED."reviews",
  "pixels" = EXCLUDED."pixels",
  "button_text" = EXCLUDED."button_text",
  "survey_text" = EXCLUDED."survey_text",
  "colors" = EXCLUDED."colors",
  "styles" = EXCLUDED."styles",
  "is_active" = EXCLUDED."is_active",
  "updated_at" = EXCLUDED."updated_at";`;
}

function appendUsersOnConflictUpsert(sql) {
  const t = sql.trim().replace(/;\s*$/, '');
  if (/on\s+conflict/i.test(t)) return `${t};`;
  /* По email: тот же адрес после create-admin не должен ломать импорт (id из дампа игнорируем при совпадении). */
  return `${t} ON CONFLICT ("email") DO UPDATE SET
  "password_hash" = EXCLUDED."password_hash",
  "full_name" = EXCLUDED."full_name",
  "role" = EXCLUDED."role",
  "updated_at" = EXCLUDED."updated_at";`;
}

async function runRawSql(sql) {
  await prisma.$executeRawUnsafe(sql);
}

async function resetProductIdSequence() {
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('products', 'id'),
      COALESCE((SELECT MAX(id) FROM products), 1)
    );
  `);
}

async function resetLandingIdSequence() {
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('landing_pages', 'id'),
      COALESCE((SELECT MAX(id) FROM landing_pages), 1)
    );
  `);
}

function emptyResultBlock() {
  return {
    success: 0,
    failed: 0,
    errors: [],
    source: null,
    bulkSql: false,
  };
}

/**
 * Загрузка только из data/*.sql: categories_rows, products_rows, landing_pages_rows, profiles_rows.
 * Пароли для импортированных пользователей: INIT_DB_IMPORTED_USERS_PASSWORD (по умолчанию ChangeAfterInit!1).
 */
export async function seedDatabaseFromDataFolder() {
  const missing = REQUIRED_SQL_FILES.filter((f) => !fileExists(f));
  if (missing.length > 0) {
    throw new Error(
      `В папке data должны лежать файлы: ${missing.join(', ')}. JSON и другие источники не используются.`
    );
  }

  const results = {
    categories: emptyResultBlock(),
    products: emptyResultBlock(),
    landings: emptyResultBlock(),
    users: emptyResultBlock(),
  };

  const categoriesPath = fileExists('categories_rows.sql');
  results.categories.source = 'categories_rows.sql';
  try {
    let sql = fs.readFileSync(categoriesPath, 'utf8');
    sql = appendCategoriesOnConflictUpsert(sql);
    await runRawSql(sql);
    results.categories.success = 1;
    results.categories.bulkSql = true;
  } catch (error) {
    results.categories.failed = 1;
    results.categories.errors.push({ name: '_sql_', error: error.message });
  }

  results.products.source = 'products_rows.sql';
  try {
    const productsRaw = fs.readFileSync(fileExists('products_rows.sql'), 'utf8');
    await ensureCategoriesReferencedByProducts(productsRaw);
    let sql = fixSupabaseJsonQuotesInSqlText(productsRaw);
    sql = fixProductPricesInInsertSql(sql);
    sql = appendProductsOnConflictUpsert(sql);
    await runRawSql(sql);
    await resetProductIdSequence();
    results.products.success = 1;
    results.products.bulkSql = true;
  } catch (error) {
    results.products.failed = 1;
    results.products.errors.push({ name: '_sql_', error: error.message });
  }

  results.landings.source = 'landing_pages_rows.sql';
  try {
    const raw = fs.readFileSync(fileExists('landing_pages_rows.sql'), 'utf8');
    let sql = transformSupabaseLandingPagesInsertSql(raw);
    sql = appendLandingsOnConflictUpsert(sql);
    await runRawSql(sql);
    await resetLandingIdSequence();
    results.landings.success = 1;
    results.landings.bulkSql = true;
  } catch (error) {
    results.landings.failed = 1;
    results.landings.errors.push({ slug: '_sql_', error: error.message });
  }

  const plain =
    process.env.INIT_DB_IMPORTED_USERS_PASSWORD?.trim() || 'ChangeAfterInit!1';
  const passwordHash = bcrypt.hashSync(plain, 10);

  results.users.source = 'profiles_rows.sql';
  try {
    const raw = fs.readFileSync(fileExists('profiles_rows.sql'), 'utf8');
    let sql = buildUsersInsertFromProfilesSql(raw, passwordHash);
    sql = appendUsersOnConflictUpsert(sql);
    await runRawSql(sql);
    results.users.success = 1;
    results.users.bulkSql = true;
  } catch (error) {
    results.users.failed = 1;
    results.users.errors.push({ email: '_sql_', error: error.message });
  }

  return results;
}
