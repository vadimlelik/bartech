const DEFAULT_WARRANTY = '1 год';

function readWarranty(specifications) {
  const specs = specifications && typeof specifications === 'object' ? specifications : {};
  for (const key of ['warranty', 'guarantee', 'Гарантия']) {
    const value = String(specs[key] || '').trim();
    if (value) return value;
  }
  return '';
}

/** Текст блока «Гарантия» на карточке: срок гарантии товара, не срок возврата. */
export function productWarrantyText(specifications) {
  const value = readWarranty(specifications) || DEFAULT_WARRANTY;
  if (/гарант/i.test(value)) return value.endsWith('.') ? value : `${value}.`;
  return `Гарантия ${value}.`;
}
