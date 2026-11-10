function sameNumber(left, right) {
  return Number(left) === Number(right);
}

/**
 * Сверяет корзину с актуальным каталогом. Позиции не удаляет.
 * Цены и наличие сейчас общие для городов, поэтому расхождения появляются
 * только если каталог изменился после добавления товара.
 */
export function reconcileCartItems(items, products) {
  const byId = new Map((products || []).map((product) => [String(product.id), product]));
  const notices = [];

  const nextItems = (items || []).map((item) => {
    const fresh = byId.get(String(item.id));
    if (!fresh) {
      notices.push({
        type: 'missing',
        id: item.id,
        name: item.name,
        message: `${item.name}: нет в текущем каталоге. Позиция оставлена в корзине.`,
      });
      return { ...item, unavailable: true };
    }

    const nextStatus = fresh.availabilityStatus || fresh.availability_status || 'in_stock';
    const prevStatus = item.availabilityStatus || item.availability_status || 'in_stock';
    let next = {
      ...item,
      unavailable: false,
      availabilityStatus: nextStatus,
      totalPrice: fresh.totalPrice ?? fresh.total_price ?? item.totalPrice ?? null,
    };

    if (prevStatus !== nextStatus) {
      const label = nextStatus === 'on_order' ? 'под заказ' : 'в наличии';
      notices.push({
        type: 'availability',
        id: item.id,
        name: item.name,
        message: `${item.name}: наличие изменилось — ${label}.`,
      });
    }

    if (!sameNumber(item.price, fresh.price)) {
      notices.push({
        type: 'price',
        id: item.id,
        name: item.name,
        from: item.price,
        to: fresh.price,
        message: `${item.name}: цена изменилась с ${item.price} на ${fresh.price} BYN.`,
      });
      next = { ...next, price: fresh.price, priceChanged: true };
    }

    return next;
  });

  return { items: nextItems, notices };
}
