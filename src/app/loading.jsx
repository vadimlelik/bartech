/**
 * Глобальный fallback для Suspense (Next.js App Router).
 * Не перекрываем экран — иначе при CSR bailout страницы магазина «залипают» на Loading.
 */
export default function Loading() {
  return null;
}
