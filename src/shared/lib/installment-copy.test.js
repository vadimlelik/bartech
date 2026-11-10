import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstallmentCityCopy } from './installment-copy.js';
import {
  INSTALLMENT_CITABILITY_ANSWER,
  INSTALLMENT_CITABILITY_QUESTION,
} from '../content/seo-faq.js';

const mogilev = {
  slug: 'mogilev',
  name: 'Могилёв',
  nameIn: 'Могилёве',
  nameDative: 'Могилёву',
  isDefault: false,
  phoneDisplay: '',
  addressLine: '',
};

test('страница рассрочки говорит городом из шапки', () => {
  const copy = buildInstallmentCityCopy(mogilev);
  const visible = [copy.h1, copy.lead, copy.question, copy.answer, copy.stepDelivery, copy.deliveryTitle, ...copy.faq.flatMap((item) => [item.q, item.a])].join('\n');
  assert.equal(visible.includes('Могилёве'), true);
  assert.equal(visible.includes('Могилёву'), true);
  assert.equal(visible.includes('Минск'), false);
  assert.equal(copy.h1, 'Купить в рассрочку — телефоны и техника в Могилёве');
  assert.equal(copy.deliveryTitle, 'Доставка по Могилёву');
  assert.equal(copy.stepDelivery, 'Курьер привезёт товар по Могилёву по условиям доставки города.');
});

test('для Минска остаётся прежний справочный текст', () => {
  const copy = buildInstallmentCityCopy({ slug: 'minsk', nameIn: 'Минске', nameDative: 'Минску', isDefault: true });
  assert.equal(copy.question, INSTALLMENT_CITABILITY_QUESTION);
  assert.equal(copy.answer, INSTALLMENT_CITABILITY_ANSWER);
  assert.equal(copy.lead.endsWith('Доставка по Минску и всей Беларуси.'), true);
});
