import {
  INSTALLMENT_CITABILITY_ANSWER,
  INSTALLMENT_CITABILITY_QUESTION,
  INSTALLMENT_FAQ_ITEMS,
} from '../content/seo-faq.js';
import { isRealAddress } from '../../entities/city/lib/city-content.js';

function placeNames(city) {
  return {
    nameIn: city?.nameIn || 'Минске',
    nameDative: city?.nameDative || 'Минску',
  };
}

function isDefaultCity(city) {
  return !city?.slug || city.slug === 'minsk' || city.isDefault;
}

/**
 * Видимые формулировки страницы «Рассрочка».
 * Город тот же, что в шапке: «в {nameIn}», «по {nameDative}».
 */
export function buildInstallmentCityCopy(city) {
  const { nameIn, nameDative } = placeNames(city);
  const phoneDisplay = city?.phoneDisplay || '+375 44 741-84-23';
  const phoneTel = city?.phoneTel || '+375447418423';
  const email = city?.email || 'baratexby@gmail.com';
  const faq = INSTALLMENT_FAQ_ITEMS.map((item) => {
    if (!item.q.startsWith('Можно ли оформить рассрочку онлайн')) return item;
    return {
      q: `Можно ли оформить рассрочку онлайн с доставкой по ${nameDative}?`,
      a: `Да. Заявку оформляете онлайн, курьер доставляет товар по ${nameDative} в день заказа или на следующий день и оформляет все документы на месте.`,
    };
  });

  const shared = {
    h1: `Купить в рассрочку — телефоны и техника в ${nameIn}`,
    lead:
      `В Texnobar можно купить в рассрочку смартфоны, ноутбуки, телевизоры и другую электронику на выгодных условиях: без переплат в рамках акций и партнёрских программ. Доставка по ${nameDative} и всей Беларуси.`,
    stepDelivery: `Курьер привезёт товар по ${nameDative} по условиям доставки города.`,
    deliveryTitle: `Доставка по ${nameDative}`,
    faq,
    phoneDisplay,
    phoneTel,
    email,
  };

  if (isDefaultCity(city)) {
    return {
      ...shared,
      question: INSTALLMENT_CITABILITY_QUESTION,
      answer: INSTALLMENT_CITABILITY_ANSWER,
    };
  }

  const address = isRealAddress(city?.addressLine) ? String(city.addressLine).trim() : '';
  const placeLine = address
    ? `Шоурум и консультации: ${address}; телефон ${phoneDisplay}, email ${email}.`
    : `Консультации: телефон ${phoneDisplay}, email ${email}.`;

  return {
    ...shared,
    question: `Как купить телефон, ноутбук или телевизор в рассрочку в ${nameIn}?`,
    answer:
      `Купить технику в рассрочку в ${nameIn} через интернет-магазин Texnobar (technobar.by) можно полностью онлайн: выберите модель в каталоге, оформите заявку на рассрочку и получите решение обычно за 15–30 минут. ` +
      `Магазин работает по всей Беларуси — доставка по ${nameDative} возможна в день заказа, в другие регионы за 1–3 рабочих дня (от 15 BYN). ` +
      `Условия партнёрских программ: срок до 12 месяцев, первоначальный взнос от 10%, в акциях — без первого платежа и без переплат. ` +
      `Texnobar (ООО «Баратех») продаёт оригинальную технику с гарантией производителя; для оформления, как правило, достаточно паспорта гражданина РБ. ` +
      `${placeLine} Подробные условия — на странице «Рассрочка» и в разделе «Оплата и доставка».`,
  };
}
