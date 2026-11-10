import { describeDelivery, cityCall, showCityField } from '@/entities/city/lib/city-content';

export function buildRegionalHomeCopy(city) {
  const nameIn = city?.nameIn || city?.name || '';
  const delivery = describeDelivery(city);
  const phone = cityCall(city);
  return {
    title: `Техника в рассрочку в ${nameIn} — Texnobar`,
    description: [
      `Техника в рассрочку в ${nameIn}.`,
      delivery,
      phone ? `Телефон: ${phone.display}.` : '',
      'Каталог и цены Texnobar.',
    ]
      .filter(Boolean)
      .join(' '),
  };
}

export function buildRegionalProductCopy(product, city) {
  const name = String(product?.name || 'Товар').trim();
  const nameIn = city?.nameIn || city?.name || 'Минске';
  const delivery = describeDelivery(city);
  const brand = product?.specifications?.brand
    ? `Бренд ${product.specifications.brand}.`
    : '';
  const price =
    product?.price !== undefined && product?.price !== null && product.price !== ''
      ? `Цена ${product.price} BYN.`
      : '';
  return {
    title: `${name} — купить в рассрочку в ${nameIn}`,
    description: [
      `Купить ${name} в рассрочку в ${nameIn}.`,
      brand,
      price,
      delivery,
      'Интернет-магазин Texnobar.',
    ]
      .filter(Boolean)
      .join(' '),
    intro: delivery
      ? `${name} в рассрочку в ${nameIn}. ${delivery}`
      : `${name} в каталоге Texnobar: цены и рассрочка в ${nameIn}.`,
    keywords: [
      `купить ${name.toLocaleLowerCase('ru')} в рассрочку`,
      `${name.toLocaleLowerCase('ru')} в рассрочку в ${nameIn}`,
      `доставка в ${nameIn}`,
      name,
    ],
  };
}

export function buildRegionalCategoryCopy(category, city) {
  const name = String(category?.name || 'Товары').trim();
  const nameIn = city?.nameIn || city?.name || '';
  const delivery = describeDelivery(city);
  return {
    title: `${name} в рассрочку в ${nameIn} — Texnobar`,
    description: [`${name} в рассрочку в ${nameIn}.`, delivery, 'Цены — в каталоге Texnobar.']
      .filter(Boolean)
      .join(' '),
    h1: `${name} в рассрочку в ${nameIn}`,
    intro: delivery
      ? `${name} в рассрочку в ${nameIn}. ${delivery}`
      : `${name} в каталоге Texnobar: цены и рассрочка в ${nameIn}.`,
    keywords: [`купить ${name.toLocaleLowerCase('ru')} в рассрочку`, `${name.toLocaleLowerCase('ru')} в рассрочку в ${nameIn}`, name],
  };
}

export function buildRegionalDeliveryCopy(city) {
  const nameIn = city?.nameIn || city?.name || '';
  const delivery = describeDelivery(city);
  const payments = (city?.paymentMethods || [])
    .filter((method) => method.enabled !== false && method.title)
    .map((method) => method.title)
    .join(', ');
  return {
    title: `Оплата и доставка в ${nameIn} — Texnobar`,
    description: [
      `Оплата и доставка в ${nameIn}.`,
      delivery,
      payments ? `Оплата: ${payments}.` : '',
    ]
      .filter(Boolean)
      .join(' '),
    h1: `Оплата и доставка в ${nameIn}`,
  };
}

export function buildRegionalContactsCopy(city) {
  const nameIn = city?.nameIn || city?.name || '';
  const phone = cityCall(city);
  const address = showCityField(city, 'address') && city?.addressLine && String(city.addressLine).trim();
  return {
    title: `Контакты в ${nameIn} — Texnobar`,
    description: [
      `Контакты Texnobar в ${nameIn}.`,
      address ? `Адрес: ${address}.` : '',
      phone ? `Телефон: ${phone.display}.` : '',
      city?.workHours ? city.workHours : '',
    ]
      .filter(Boolean)
      .join(' '),
    h1: `Контакты в ${nameIn}`,
  };
}
