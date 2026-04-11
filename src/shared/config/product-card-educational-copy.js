/**
 * Готовый текст для карточки товара: кому подойдёт, на что смотреть в характеристиках, доверие и действие.
 * Привязка к categoryId (не из БД описания товара). Название модели — из product.name.
 */

/** Общий финальный абзац (как в ТЗ). */
const TRUST_AND_ACTION =
  'Покупка в Texnobar — с рассрочкой (условия на сайте), доставкой по Беларуси и поддержкой при выборе. Цена и наличие актуальны в карточке товара.';

/** Шаблоны без привязки к имени — универсальные формулировки по типу техники. */
const TEMPLATES = {
  smartphone: {
    audience:
      'Смартфон подойдёт для ежедневного общения, соцсетей и стриминга, с запасом по памяти для приложений и фото.',
    specs:
      'Обратите внимание на экран, процессор и объём накопителя — от этого зависит плавность интерфейса и сколько фото/видео можно хранить без очистки.',
    trust: TRUST_AND_ACTION,
  },
  laptop: {
    audience:
      'Ноутбук подойдёт для учёбы, работы из дома и развлечений: от документов и видеозвонков до монтажа и игр в зависимости от конфигурации.',
    specs:
      'Смотрите на процессор, объём оперативной памяти и тип накопителя (SSD), а также диагональ и разрешение экрана — от этого зависит скорость и комфорт работы.',
    trust: TRUST_AND_ACTION,
  },
  tv: {
    audience:
      'Телевизор подойдёт для просмотра фильмов, сериалов и спорта в гостиной или спальне, в том числе со стриминг-сервисами и игровыми консолями.',
    specs:
      'Обратите внимание на диагональ, разрешение и частоту кадров, поддержку HDR и набор разъёмов — от этого зависит картинка и удобство подключения источников.',
    trust: TRUST_AND_ACTION,
  },
  large_appliance: {
    audience:
      'Техника подойдёт для ежедневного использования дома: хранение продуктов или стирка белья с удобными режимами под тип ткани и загрузку.',
    specs:
      'Смотрите на объём камеры или загрузки, класс энергопотребления, уровень шума и набор программ — от этого зависит комфорт и расход ресурсов.',
    trust: TRUST_AND_ACTION,
  },
  pc: {
    audience:
      'Персональный компьютер подойдёт для офиса, учёбы, творчества и игр — в зависимости от процессора, видеокарты и объёма памяти.',
    specs:
      'Обратите внимание на процессор и систему охлаждения, видеокарту, ОЗУ и накопитель, а также блок питания — от этого зависит производительность и запас под обновления.',
    trust: TRUST_AND_ACTION,
  },
  game_console: {
    audience:
      'Игровая приставка подойдёт для игр на большом экране, онлайн-сервисов и мультимедиа в гостиной.',
    specs:
      'Смотрите на комплектацию, объём встроенной памяти и поддержку разрешения/частоты на вашем телевизоре, а также подписки и экосистему игр.',
    trust: TRUST_AND_ACTION,
  },
  motorcycle: {
    audience:
      'Мототехника подойдёт для поездок по городу и за его пределами при соблюдении правил и экипировки; подберите класс под свой опыт и задачи.',
    specs:
      'Обратите внимание на объём двигателя, тип и мощность, тормоза, подвеску и комплектацию — от этого зависит характер езды и обслуживание.',
    trust: TRUST_AND_ACTION,
  },
  micromobility: {
    audience:
      'Электротранспорт подойдёт для коротких поездок по городу и дачным маршрутам при соблюдении ПДД и зарядной инфраструктуры.',
    specs:
      'Смотрите на запас хода, мощность и тип мотора, вес и грузоподъёмность, тормоза и защиту от влаги — от этого зависит безопасность и ресурс.',
    trust: TRUST_AND_ACTION,
  },
  garden: {
    audience:
      'Мотоблок и садовая техника подойдут для обработки почвы, перевозки грузов и работы на участке в зависимости от мощности и навесного оборудования.',
    specs:
      'Обратите внимание на мощность двигателя, тип привода, ширину захвата и совместимость с навесным — от этого зависит объём работ и срок службы.',
    trust: TRUST_AND_ACTION,
  },
  accessories: {
    audience:
      'Аксессуар подойдёт для подключения и совместимости вашей техники: питание, переходы и удобство в повседневном использовании.',
    specs:
      'Проверьте тип разъёма, выходную мощность и протоколы совместимости с вашим устройством — от этого зависит стабильность работы и безопасность.',
    trust: TRUST_AND_ACTION,
  },
  generic: {
    audience:
      'Товар подойдёт для повседневных задач в рамках своего класса техники; уточните сценарии использования по характеристикам ниже.',
    specs:
      'Сверяйте ключевые параметры в карточке с вашими требованиями: производительность, объёмы, габариты и комплектация.',
    trust: TRUST_AND_ACTION,
  },
};

/** categoryId из БД → ключ шаблона */
const CATEGORY_ID_TO_TEMPLATE = {
  apple: 'smartphone',
  honor: 'smartphone',
  Inoi: 'smartphone',
  poco: 'smartphone',
  samsung: 'smartphone',
  xiaomi: 'smartphone',
  Armoredphones: 'smartphone',
  Laptops: 'laptop',
  tw: 'tv',
  fridge: 'large_appliance',
  washing: 'large_appliance',
  pc: 'pc',
  'game-console': 'game_console',
  motorcycles: 'motorcycle',
  bicycles: 'micromobility',
  'walk-behind-tractor': 'garden',
  adapter: 'accessories',
};

function resolveTemplateKey(categoryId) {
  if (!categoryId) return 'generic';
  const id = String(categoryId).trim();
  if (CATEGORY_ID_TO_TEMPLATE[id]) return CATEGORY_ID_TO_TEMPLATE[id];
  const lower = id.toLowerCase();
  for (const key of Object.keys(CATEGORY_ID_TO_TEMPLATE)) {
    if (key.toLowerCase() === lower) return CATEGORY_ID_TO_TEMPLATE[key];
  }
  return 'generic';
}

/**
 * @param {{ name?: string, categoryId?: string | null, category_id?: string | null }} product
 * @returns {{ sectionTitle: string, modelLine: string, audienceLabel: string, audience: string, specsLabel: string, specs: string, trustLabel: string, trust: string }}
 */
export function getProductEducationalCopy(product) {
  const modelName =
    (product?.name && String(product.name).trim()) || 'модель из каталога';
  const cid = product?.categoryId ?? product?.category_id ?? null;
  const templateKey = resolveTemplateKey(cid);
  const tpl = TEMPLATES[templateKey] || TEMPLATES.generic;

  return {
    sectionTitle: 'Кратко о товаре',
    modelLine: `Модель: ${modelName}`,
    audienceLabel: 'Кому подойдёт',
    audience: tpl.audience,
    specsLabel: 'На что смотреть в характеристиках',
    specs: tpl.specs,
    trustLabel: 'Покупка в Texnobar',
    trust: tpl.trust,
  };
}
