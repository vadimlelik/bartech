export const INSTALLMENT_TERMS = [6, 10, 12];
export const DEFAULT_INSTALLMENT_TERM = 12;

export function getFullPrice(product) {
  const total = Number(product?.totalPrice ?? product?.total_price);
  return total > 0 ? total : 0;
}

/**
 * `price` в каталоге — ежемесячный платёж на 12 месяцев.
 * Другие сроки считаются от полной цены, а если её нет — пропорционально этому платежу.
 */
export function getMonthlyPayment(product, term = DEFAULT_INSTALLMENT_TERM, allowedTerms = INSTALLMENT_TERMS) {
  const terms = allowedTerms?.length ? allowedTerms : INSTALLMENT_TERMS;
  const fallbackTerm = terms.includes(DEFAULT_INSTALLMENT_TERM) ? DEFAULT_INSTALLMENT_TERM : terms[terms.length - 1];
  const months = terms.includes(term) ? term : fallbackTerm;
  const storedMonthly = Number(product?.price) || 0;
  const fullPrice = getFullPrice(product);

  if (months === DEFAULT_INSTALLMENT_TERM && storedMonthly > 0) {
    return Math.round(storedMonthly);
  }

  if (fullPrice > 0) {
    return Math.max(1, Math.round(fullPrice / months));
  }

  if (storedMonthly > 0) {
    return Math.max(1, Math.round((storedMonthly * DEFAULT_INSTALLMENT_TERM) / months));
  }

  return 0;
}

export function formatByn(value) {
  const amount = Math.round(Number(value) || 0);
  return `${amount.toLocaleString('ru-RU')} BYN`;
}

export function toCatalogCard(product) {
  if (!product) return null;
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  return {
    id: product.id,
    name: product.name || product.title || 'Товар',
    price: product.price ?? 0,
    totalPrice: product.totalPrice ?? product.total_price ?? null,
    image: product.image || images[0] || null,
    availabilityStatus:
      product.availabilityStatus || product.availability_status || 'in_stock',
  };
}
