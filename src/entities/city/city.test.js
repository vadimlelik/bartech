import test from 'node:test';
import assert from 'node:assert/strict';
import {
  citySlugError,
  citySwitchHref,
  isCityContentPath,
  redirectFromDefaultCityPrefix,
  splitCityFromPath,
  withCityPrefix,
} from '../../shared/config/city-routes.js';
import { hasUniqueCityContent, isCityPublic, isRealAddress, resolveHomeCards, showCityField } from './lib/city-content.js';
import { deliveryFee, isLocalityServed, minOrderShortfall, orderGoodsTotal } from './lib/delivery-rules.js';
import { reconcileCartItems } from '../cart/lib/reconcile-cart.js';
import { getMonthlyPayment } from '../product/lib/pricing.js';

const grodno = {
  slug: 'grodno',
  name: 'Гродно',
  deliveryLocalities: ['Гродно', 'Лида'],
  minOrderAmount: 200,
  freeDeliveryFrom: 1000,
};

test('Минск остаётся на корне, городской префикс только у витринных страниц', () => {
  assert.equal(withCityPrefix('minsk', '/catalog'), '/catalog');
  assert.equal(withCityPrefix('grodno', '/catalog'), '/catalog');
  assert.equal(withCityPrefix('grodno', '/categories/phones'), '/grodno/categories/phones');
  assert.equal(withCityPrefix('grodno', '/grodno/products/5'), '/grodno/products/5');
  assert.equal(withCityPrefix('minsk', '/products/5'), '/products/5');
  assert.equal(withCityPrefix('grodno', '/'), '/grodno');
  assert.equal(citySwitchHref('grodno', '/products/5?utm=1'), '/grodno/products/5?utm=1');
  assert.equal(citySwitchHref('minsk', '/grodno/products/5'), '/products/5');
  assert.equal(citySwitchHref('minsk', '/grodno/contacts'), '/contacts');
  assert.equal(isCityContentPath('/payment_delivery'), true);
  assert.equal(isCityContentPath('/products/5'), true);
  assert.equal(isCityContentPath('/cart'), false);
  assert.equal(redirectFromDefaultCityPrefix('/minsk/contacts'), '/contacts');
  assert.equal(redirectFromDefaultCityPrefix('/minsk'), '/');
  assert.equal(redirectFromDefaultCityPrefix('/grodno'), null);
  assert.deepEqual(splitCityFromPath('/brest/contacts'), { slug: 'brest', pathname: '/contacts' });
  assert.deepEqual(splitCityFromPath('/contacts'), { slug: null, pathname: '/contacts' });
  assert.deepEqual(splitCityFromPath('/baranovichi/contacts', ['baranovichi']), {
    slug: 'baranovichi',
    pathname: '/contacts',
  });
  assert.equal(withCityPrefix('baranovichi', '/categories/phones', ['baranovichi']), '/baranovichi/categories/phones');
  assert.equal(citySwitchHref('minsk', '/baranovichi/contacts', ['baranovichi']), '/contacts');
  assert.equal(citySlugError('baranovichi'), '');
  assert.equal(citySlugError('cart') !== '', true);
  assert.equal(citySlugError('phone') !== '', true);
});

test('на сайт попадает включённый город, даже без адреса и пунктов выдачи', () => {
  assert.equal(isRealAddress('Адрес в Гродно уточняется'), false);
  assert.equal(isRealAddress('г. Минск, ул. Сурганова, д. 43'), true);
  const grodno = { slug: 'grodno', enabled: true, deliveryMethods: [], pickupPoints: [], faq: [], aboutParagraphs: [] };
  assert.equal(isCityPublic(grodno), true);
  assert.equal(isCityPublic({ slug: 'grodno', enabled: false, deliveryMethods: [], pickupPoints: [], faq: [], aboutParagraphs: [] }), false);
  assert.equal(isCityPublic({ slug: 'minsk', enabled: true, isDefault: true, deliveryMethods: [] }), true);
  assert.equal(hasUniqueCityContent({
    enabled: false,
    deliveryMethods: [{ title: 'Курьер', eta: '1 день', enabled: true }],
  }), true);
  assert.equal(isCityPublic({
    enabled: true,
    deliveryMethods: [{ title: 'Курьер', eta: '1 день', enabled: true }],
    pickupPoints: [],
    faq: [],
    aboutParagraphs: [],
  }), true);
  assert.equal(showCityField({ publicFields: {} }, 'freeDelivery'), true);
  assert.equal(showCityField({ publicFields: { freeDelivery: false } }, 'freeDelivery'), false);
});

test('тексты карточек главной свои у города, пустые остаются стандартными', () => {
  const standard = resolveHomeCards({ nameIn: 'Гродно', nameDative: 'Гродно', homeCards: {} });
  assert.equal(standard.heroTitle, 'Техника в рассрочку в Гродно');
  assert.equal(standard.installmentTitle, 'Рассрочка 0%');
  assert.deepEqual(standard.installmentPoints, ['Без первого взноса', 'Без переплат', 'Одобрение за сутки']);
  assert.equal(standard.salesText, 'Текущие предложения магазина');
  assert.equal(standard.deliveryText, 'Оплата и получение заказа');

  const custom = resolveHomeCards({
    nameIn: 'Гродно',
    nameDative: 'Гродно',
    homeCards: {
      heroTitle: 'Свой заголовок',
      heroText: 'Свой абзац',
      installmentTitle: 'Рассрочка в Гродно',
      installmentPoints: ['Свой пункт'],
      salesTitle: 'Скидки',
      salesText: 'Только в Гродно',
      deliveryTitle: 'Привезём',
      deliveryText: 'За 1 день',
    },
  });
  assert.equal(custom.heroTitle, 'Свой заголовок');
  assert.equal(custom.heroText, 'Свой абзац');
  assert.equal(custom.installmentTitle, 'Рассрочка в Гродно');
  assert.deepEqual(custom.installmentPoints, ['Свой пункт']);
  assert.equal(custom.salesTitle, 'Скидки');
  assert.equal(custom.salesText, 'Только в Гродно');
  assert.equal(custom.deliveryTitle, 'Привезём');
  assert.equal(custom.deliveryText, 'За 1 день');
});

test('адрес должен относиться к городу или его зоне доставки', () => {
  assert.equal(isLocalityServed(grodno, 'г. Лида'), true);
  assert.equal(isLocalityServed(grodno, 'Минск'), false);
});

test('минимальная сумма и бесплатная доставка считаются от полной цены', () => {
  const items = [{ price: 30, totalPrice: 360, quantity: 1 }];
  assert.equal(orderGoodsTotal(items), 360);
  assert.equal(minOrderShortfall(grodno, 360), 0);
  assert.equal(minOrderShortfall(grodno, 100), 100);
  assert.equal(deliveryFee({ code: 'courier', price: 15 }, 1000, 1000), 0);
  assert.equal(deliveryFee({ code: 'courier', price: 15 }, 500, 1000), 15);
  assert.equal(deliveryFee({ code: 'pickup', price: 0 }, 10, 1000), 0);
});

test('смена города не удаляет позицию и показывает изменение цены', () => {
  const result = reconcileCartItems(
    [{ id: 1, name: 'Телефон', price: 40, availabilityStatus: 'in_stock' }],
    [{ id: 1, name: 'Телефон', price: 45, availabilityStatus: 'on_order', totalPrice: 500 }],
  );
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].price, 45);
  assert.equal(result.notices.some((notice) => notice.type === 'price'), true);
  assert.equal(result.notices.some((notice) => notice.type === 'availability'), true);
});

test('платёж рассрочки считается из полной цены и срока города', () => {
  const product = { price: 50, totalPrice: 600 };
  assert.equal(getMonthlyPayment(product, 12), 50);
  assert.equal(getMonthlyPayment(product, 6), 100);
});
