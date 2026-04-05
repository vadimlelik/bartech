import fs from 'fs';
import path from 'path';

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const SKIP_DIR_NAMES = new Set(['.git', 'node_modules', '.next']);

/**
 * Рекурсивно собирает изображения из `public/` (URL как у Next.js: /путь/относительно/public).
 */
export function listImagesUnderPublic(cwd = process.cwd()) {
  const publicDir = path.join(cwd, 'public');
  if (!fs.existsSync(publicDir)) {
    return [];
  }

  const out = [];

  function walk(absDir) {
    let entries;
    try {
      entries = fs.readdirSync(absDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const ent of entries) {
      if (ent.name.startsWith('.')) continue;
      const full = path.join(absDir, ent.name);

      if (ent.isDirectory()) {
        if (SKIP_DIR_NAMES.has(ent.name)) continue;
        walk(full);
        continue;
      }

      const ext = path.extname(ent.name).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) continue;

      let stat;
      try {
        stat = fs.statSync(full);
      } catch {
        continue;
      }

      const rel = path.relative(publicDir, full);
      const urlPath = rel.split(path.sep).join('/');

      out.push({
        name: ent.name,
        path: urlPath,
        url: `/${urlPath}`,
        size: stat.size,
        created_at: stat.mtime,
        updated_at: stat.mtime,
        source: 'public',
      });
    }
  }

  walk(publicDir);
  return out;
}
