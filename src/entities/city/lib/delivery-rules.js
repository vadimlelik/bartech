export function normalizeLocality(value) {
  return String(value || '')
    .trim()
    .replace(/^г\.?\s+/i, '')
    .toLocaleLowerCase('ru');
}

export function isLocalityServed(city, locality) {
  const value = normalizeLocality(locality);
  if (!value || !city) return false;
  const names = [city.name, ...(city.deliveryLocalities || [])];
  return names.some((name) => normalizeLocality(name) === value);
}

export function lineFullPrice(item) {
  const full = Number(item?.totalPrice ?? item?.total_price);
  if (full > 0) return full;
  return Number(item?.price) || 0;
}

export function orderGoodsTotal(items) {
  return (items || []).reduce(
    (sum, item) => sum + lineFullPrice(item) * (Number(item?.quantity) || 1),
    0,
  );
}

export function deliveryFee(method, goodsTotal, freeDeliveryFrom) {
  if (!method || method.code === 'pickup') return 0;
  if (freeDeliveryFrom != null && goodsTotal >= Number(freeDeliveryFrom)) return 0;
  return Number(method.price) || 0;
}

export function minOrderShortfall(city, goodsTotal) {
  const minimum = city?.minOrderAmount;
  if (minimum == null || Number(minimum) <= 0) return 0;
  return Math.max(0, Number(minimum) - goodsTotal);
}
