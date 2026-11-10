/** Public category URL. Database ids may keep their original case; the path is always lowercase. */
export function categoryPublicPath(id) {
  const slug = encodeURIComponent(String(id || '').trim().toLowerCase());
  return `/categories/${slug}`;
}
