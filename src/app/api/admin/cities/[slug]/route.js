import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { DEFAULT_CITY_SLUG } from '@/shared/config/city-routes';
import { DEFAULT_INSTALLMENT_TERMS } from '@/entities/city/model/cities';
import { isRealAddress, normalizeHomeCards } from '@/entities/city/lib/city-content';

function asInt(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
}

function asCoord(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function asList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function asLines(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

const PUBLIC_FIELD_KEYS = ['address', 'street', 'postal', 'coordinates', 'minOrder', 'freeDelivery', 'localities', 'downPayment'];

function publicFieldsFromBody(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const flags = {};
  for (const key of PUBLIC_FIELD_KEYS) {
    if (source[key] === false) flags[key] = false;
  }
  return flags;
}

function homeCardsFromBody(body) {
  const hasFlatFields = [
    'homeHeroTitle',
    'homeHeroText',
    'homeInstallmentTitle',
    'homeInstallmentPoints',
    'homeSalesTitle',
    'homeSalesText',
    'homeDeliveryTitle',
    'homeDeliveryText',
  ].some((key) => body[key] !== undefined);
  if (!hasFlatFields) return normalizeHomeCards(body.homeCards);
  return normalizeHomeCards({
    heroTitle: body.homeHeroTitle,
    heroText: body.homeHeroText,
    installmentTitle: body.homeInstallmentTitle,
    installmentPoints: body.homeInstallmentPoints,
    salesTitle: body.homeSalesTitle,
    salesText: body.homeSalesText,
    deliveryTitle: body.homeDeliveryTitle,
    deliveryText: body.homeDeliveryText,
  });
}

function aboutFromBody(body) {
  if (typeof body.aboutText === 'string') {
    return body.aboutText
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 6);
  }
  return asList(body.aboutParagraphs).slice(0, 6);
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    const { slug } = await params;
    const body = await request.json();
    const existing = await prisma.city.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Город не найден' }, { status: 404 });
    }

    const enabled = slug === DEFAULT_CITY_SLUG ? true : Boolean(body.enabled);
    const bullets = asLines(body.installmentBullets);
    const installmentTerms = {
      months: DEFAULT_INSTALLMENT_TERMS.months,
      defaultMonths: DEFAULT_INSTALLMENT_TERMS.defaultMonths,
      downPaymentPercent:
        body.downPaymentPercent === null ||
        body.downPaymentPercent === undefined ||
        body.downPaymentPercent === ''
          ? DEFAULT_INSTALLMENT_TERMS.downPaymentPercent
          : Number(body.downPaymentPercent),
      bullets: bullets.length ? bullets : DEFAULT_INSTALLMENT_TERMS.bullets,
    };

    const deliveryMethods = Array.isArray(body.deliveryMethods) ? body.deliveryMethods : [];
    const pickupPoints = Array.isArray(body.pickupPoints) ? body.pickupPoints : [];
    const paymentMethods = Array.isArray(body.paymentMethods) ? body.paymentMethods : [];
    const aboutParagraphs = aboutFromBody(body);
    const faq = String(body.faqText || '')
      .split('\n')
      .map((line) => {
        const [question, ...rest] = line.split('|');
        return { q: String(question || '').trim(), a: rest.join('|').trim() };
      })
      .filter((item) => item.q && item.a)
      .slice(0, 8);
    const hasDelivery = deliveryMethods.some(
      (method) => method.enabled !== false && String(method.title || '').trim() && String(method.eta || '').trim(),
    );
    const hasPickup = pickupPoints.some(
      (point) => point.enabled !== false && isRealAddress(point.address),
    );
    const publicFields = publicFieldsFromBody(body.publicFields);
    const homeCards = homeCardsFromBody(body);

    await prisma.$transaction(async (tx) => {
      await tx.city.update({
        where: { slug },
        data: {
          name: String(body.name || existing.name).slice(0, 80),
          nameIn: String(body.nameIn || existing.nameIn).slice(0, 80),
          nameGenitive: String(body.nameGenitive || existing.nameGenitive || '').slice(0, 80),
          nameDative: String(body.nameDative || existing.nameDative || '').slice(0, 80),
          regionName: String(body.regionName || existing.regionName).slice(0, 120),
          enabled,
          phoneDisplay: String(body.phoneDisplay || '').slice(0, 40),
          phoneTel: String(body.phoneTel || '').replace(/[^\d+]/g, '').slice(0, 20),
          email: String(body.email || '').slice(0, 120),
          workHours: String(body.workHours || '').slice(0, 200),
          postalCode: String(body.postalCode || '').slice(0, 12),
          streetAddress: String(body.streetAddress || '').slice(0, 300),
          addressLine: String(body.addressLine || '').slice(0, 400),
          latitude: asCoord(body.latitude),
          longitude: asCoord(body.longitude),
          messengers: Array.isArray(body.messengers) ? body.messengers.slice(0, 10) : [],
          minOrderAmount: asInt(body.minOrderAmount),
          freeDeliveryFrom: asInt(body.freeDeliveryFrom),
          deliveryLocalities: asList(body.deliveryLocalities),
          installmentTerms,
          hasPickup,
          hasDelivery,
          aboutParagraphs,
          faq,
          publicFields,
          homeCards,
        },
      });

      await tx.cityDeliveryMethod.deleteMany({ where: { citySlug: slug } });
      if (deliveryMethods.length) {
        await tx.cityDeliveryMethod.createMany({
          data: deliveryMethods.slice(0, 12).map((method, index) => ({
            id: String(method.id || `${slug}-${method.code || 'method'}-${index}`).slice(0, 80),
            citySlug: slug,
            code: String(method.code || 'courier').slice(0, 40),
            title: String(method.title || 'Доставка').slice(0, 120),
            description: String(method.description || '').slice(0, 400),
            price: asInt(method.price) || 0,
            eta: String(method.eta || '').slice(0, 160),
            enabled: method.enabled !== false,
            sortOrder: index,
          })),
        });
      }

      await tx.cityPickupPoint.deleteMany({ where: { citySlug: slug } });
      if (pickupPoints.length) {
        await tx.cityPickupPoint.createMany({
          data: pickupPoints.slice(0, 20).map((point, index) => ({
            id: String(point.id || `${slug}-pickup-${index}`).slice(0, 80),
            citySlug: slug,
            title: String(point.title || 'Пункт выдачи').slice(0, 120),
            address: String(point.address || '').slice(0, 300),
            hours: String(point.hours || '').slice(0, 160),
            enabled: point.enabled !== false,
            sortOrder: index,
          })),
        });
      }

      await tx.cityPaymentMethod.deleteMany({ where: { citySlug: slug } });
      if (paymentMethods.length) {
        await tx.cityPaymentMethod.createMany({
          data: paymentMethods.slice(0, 12).map((method, index) => ({
            id: String(method.id || `${slug}-pay-${index}`).slice(0, 80),
            citySlug: slug,
            code: String(method.code || 'cash').slice(0, 40),
            title: String(method.title || 'Оплата').slice(0, 160),
            enabled: method.enabled !== false,
            sortOrder: index,
          })),
        });
      }
    });

    revalidateTag('cities');
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error.message === 'Unauthorized' || String(error.message).includes('Forbidden')) {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
    }
    console.error('PUT city:', error);
    return NextResponse.json({ error: 'Не удалось сохранить город' }, { status: 500 });
  }
}
