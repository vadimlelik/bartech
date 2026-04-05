import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';

const SPEC_FILTER_FIELDS = [
  'memory',
  'ram',
  'processor',
  'display',
  'camera',
  'battery',
  'os',
  'color',
  'year',
];

/** Whitelisted JSON paths for SQL filter clauses (avoid dynamic SQL injection). */
const SPEC_COALESCE_SQL = {
  memory: 'COALESCE(specifications->>\'memory\',\'\')',
  ram: 'COALESCE(specifications->>\'ram\',\'\')',
  processor: 'COALESCE(specifications->>\'processor\',\'\')',
  display: 'COALESCE(specifications->>\'display\',\'\')',
  camera: 'COALESCE(specifications->>\'camera\',\'\')',
  battery: 'COALESCE(specifications->>\'battery\',\'\')',
  os: 'COALESCE(specifications->>\'os\',\'\')',
  color: 'COALESCE(specifications->>\'color\',\'\')',
  year: 'COALESCE(specifications->>\'year\',\'\')',
};

function normalizeProduct(product) {
  if (!product) return null;
  return {
    ...product,
    categoryId: product.categoryId ?? product.category_id ?? null,
    category_id: product.categoryId ?? product.category_id ?? null,
  };
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  });
  return (products || []).map(normalizeProduct);
}

export async function getProductById(id) {
  if (!id) return null;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  return normalizeProduct(product);
}

function prepareProductData(productData) {
  const priceRaw = productData?.price;
  const priceNum =
    typeof priceRaw === 'number'
      ? Math.round(priceRaw)
      : Math.round(Number.parseFloat(String(priceRaw ?? 0)) || 0);

  return {
    name: productData?.name || null,
    category: productData?.category || null,
    categoryId: productData?.category_id || productData?.categoryId || null,
    price: priceNum,
    image: productData?.image || null,
    images: Array.isArray(productData?.images)
      ? productData.images
      : productData?.images
        ? [productData.images]
        : [],
    description: productData?.description || null,
    specifications: (() => {
      const sp = productData?.specifications;
      if (sp !== null && typeof sp === 'object' && !Array.isArray(sp)) return sp;
      if (typeof sp === 'string' && sp.trim()) {
        try {
          return JSON.parse(sp);
        } catch {
          return {};
        }
      }
      return {};
    })(),
  };
}

export async function upsertProduct(productData) {
  try {
    const processedData = prepareProductData(productData);
    Object.keys(processedData).forEach((key) => {
      if (processedData[key] === '') processedData[key] = null;
    });

    const idRaw = productData?.id;
    if (idRaw === undefined || idRaw === null || idRaw === '') {
      return addProduct(productData);
    }

    const id = Number(idRaw);
    if (Number.isNaN(id)) {
      return { success: false, error: 'Invalid product id' };
    }

    const row = await prisma.product.upsert({
      where: { id },
      create: { id, ...processedData },
      update: processedData,
    });

    return { success: true, product: normalizeProduct(row) };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to upsert product' };
  }
}

export async function addProduct(productData) {
  try {
    const processedData = prepareProductData(productData);

    Object.keys(processedData).forEach((key) => {
      if (processedData[key] === '') processedData[key] = null;
    });

    const created = await prisma.product.create({
      data: processedData,
    });

    return { success: true, product: normalizeProduct(created) };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

export async function updateProduct(id, productData) {
  try {
    if (!id) return { success: false, error: 'Product ID is required' };

    const processedData = {
      name: productData?.name ?? undefined,
      category: productData?.category ?? undefined,
      categoryId: productData?.category_id ?? productData?.categoryId ?? undefined,
      price: productData?.price ?? undefined,
      image: productData?.image ?? undefined,
      images: Array.isArray(productData?.images)
        ? productData.images
        : productData?.images
          ? [productData.images]
          : undefined,
      description: productData?.description ?? undefined,
      specifications: productData?.specifications ?? undefined,
    };

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: processedData,
    });

    return { success: true, product: normalizeProduct(updated) };
  } catch (error) {
    if (error?.code === 'P2025') {
      return { success: false, error: 'Product not found' };
    }
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

export async function deleteProduct(id) {
  try {
    if (!id) return { success: false, error: 'Product ID is required' };
    await prisma.product.delete({ where: { id: Number(id) } });
    return { success: true };
  } catch (error) {
    if (error?.code === 'P2025') {
      return { success: false, error: 'Product not found' };
    }
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

export async function getProductsByCategory(categoryId) {
  if (!categoryId) return [];
  const products = await prisma.product.findMany({
    where: { categoryId: String(categoryId) },
    orderBy: { id: 'desc' },
  });
  return (products || []).map(normalizeProduct);
}

function mapRawProductRow(row) {
  if (!row) return null;
  const specs = row.specifications;
  const specObj =
    specs === null || specs === undefined
      ? {}
      : typeof specs === 'object' && !Array.isArray(specs)
        ? specs
        : {};
  return normalizeProduct({
    id: Number(row.id),
    name: row.name,
    category: row.category,
    categoryId: row.category_id,
    price: row.price,
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description,
    specifications: specObj,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function buildProductsWhereSql({ categoryId, search, filters, ids }) {
  const parts = [];
  if (ids && ids.length > 0) {
    const numericIds = ids.map(Number).filter((n) => !Number.isNaN(n));
    if (numericIds.length === 0) {
      return { sql: Prisma.sql`FALSE`, emptyIds: true };
    }
    parts.push(Prisma.sql`id IN (${Prisma.join(numericIds)})`);
    return { sql: Prisma.join(parts, ' AND '), emptyIds: false };
  }
  if (categoryId) {
    const cid = String(categoryId);
    parts.push(
      Prisma.sql`(
        category_id = ${cid}
        OR LOWER(TRIM(COALESCE(specifications->>'brand', ''))) = LOWER(${cid})
      )`,
    );
  }
  if (search && String(search).trim()) {
    const escaped = String(search).trim().replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
    const term = `%${escaped}%`;
    parts.push(Prisma.sql`name ILIKE ${term} ESCAPE '\\'`);
  }
  for (const field of SPEC_FILTER_FIELDS) {
    const value = filters?.[field];
    if (value) {
      const colExpr = SPEC_COALESCE_SQL[field];
      if (colExpr) {
        parts.push(
          Prisma.sql`LOWER(TRIM(${Prisma.raw(colExpr)})) = LOWER(${String(value)})`,
        );
      }
    }
  }
  if (parts.length === 0) {
    return { sql: Prisma.sql`TRUE`, emptyIds: false };
  }
  return { sql: Prisma.join(parts, ' AND '), emptyIds: false };
}

function orderBySql(sortBy, sort) {
  const col = sortBy === 'price' ? 'price' : 'name';
  const dir = sort === 'desc' ? 'DESC' : 'ASC';
  return Prisma.sql`ORDER BY ${Prisma.raw(col)} ${Prisma.raw(dir)}`;
}

function collectAvailableFilters(specRows) {
  const rows = specRows || [];
  const pick = (key) =>
    [
      ...new Set(
        rows.map((r) => {
          const s = r?.specifications;
          const o =
            s && typeof s === 'object' && !Array.isArray(s) ? s : {};
          return o[key];
        }),
      ),
    ]
      .filter(Boolean)
      .sort();

  return {
    memory: pick('memory'),
    ram: pick('ram'),
    processor: pick('processor'),
    display: pick('display'),
    camera: pick('camera'),
    battery: pick('battery'),
    os: pick('os'),
    color: pick('color'),
    year: pick('year'),
    brand: pick('brand'),
  };
}

export async function getProducts({
  categoryId,
  search,
  sort = 'asc',
  sortBy = 'name',
  page = 1,
  limit = 12,
  ids = [],
  filters = {},
} = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 12);
  const offset = (safePage - 1) * safeLimit;

  const { sql: whereSql, emptyIds } = buildProductsWhereSql({
    categoryId,
    search,
    filters,
    ids,
  });

  if (emptyIds) {
    return {
      products: [],
      filters: collectAvailableFilters([]),
      pagination: {
        total: 0,
        page: safePage,
        limit: safeLimit,
        pages: 0,
      },
    };
  }

  const orderFrag = orderBySql(sortBy, sort);

  const [countRows, specRows, productRows] = await Promise.all([
    prisma.$queryRaw`
      SELECT COUNT(*)::int AS c FROM products WHERE ${whereSql}
    `,
    prisma.$queryRaw`
      SELECT specifications FROM products WHERE ${whereSql}
    `,
    prisma.$queryRaw`
      SELECT id, name, category, category_id, price, image, images, description, specifications, created_at, updated_at
      FROM products
      WHERE ${whereSql}
      ${orderFrag}
      LIMIT ${safeLimit} OFFSET ${offset}
    `,
  ]);

  const total = Number(countRows?.[0]?.c ?? 0);
  const availableFilters = collectAvailableFilters(specRows);
  const products = (productRows || []).map(mapRawProductRow).filter(Boolean);

  return {
    products,
    filters: availableFilters,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      pages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    },
  };
}

export async function listProductsForAdmin({
  page = 1,
  limit = 30,
  search = '',
} = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 30));
  const skip = (safePage - 1) * safeLimit;

  const where = {};
  if (search && String(search).trim()) {
    where.name = { contains: String(search).trim(), mode: 'insensitive' };
  }

  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { id: 'desc' },
      skip,
      take: safeLimit,
    }),
  ]);

  return {
    products: rows.map(normalizeProduct),
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}


