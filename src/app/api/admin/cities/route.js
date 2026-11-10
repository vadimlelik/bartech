import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { prisma } from '@/shared/lib/prisma';
import { citySlugError, normalizeCitySlug } from '@/shared/config/city-routes';
import { DEFAULT_INSTALLMENT_TERMS, getAllCities } from '@/entities/city/model/cities';

export async function GET() {
  try {
    await requireAdmin();
    const cities = await getAllCities({ fresh: true });
    return NextResponse.json({ cities });
  } catch (error) {
    const status = error.message === 'Unauthorized' || String(error.message).includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: 'Нет доступа' }, { status });
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const slug = normalizeCitySlug(body.slug);
    const slugError = citySlugError(slug);
    if (slugError) {
      return NextResponse.json({ error: slugError }, { status: 400 });
    }

    const name = String(body.name || '').trim();
    const nameIn = String(body.nameIn || '').trim();
    if (!name || !nameIn) {
      return NextResponse.json({ error: 'Укажите название и предложный падеж' }, { status: 400 });
    }

    const [existing, landing] = await Promise.all([
      prisma.city.findUnique({ where: { slug } }),
      prisma.landing.findUnique({ where: { slug } }).catch(() => null),
    ]);
    if (existing) {
      return NextResponse.json({ error: 'Город с таким адресом уже есть' }, { status: 409 });
    }
    if (landing) {
      return NextResponse.json({ error: 'Этот адрес занят лендингом' }, { status: 409 });
    }

    const count = await prisma.city.count();
    await prisma.city.create({
      data: {
        slug,
        name: name.slice(0, 80),
        nameIn: nameIn.slice(0, 80),
        nameGenitive: String(body.nameGenitive || '').trim().slice(0, 80),
        nameDative: String(body.nameDative || '').trim().slice(0, 80),
        regionName: String(body.regionName || '').trim().slice(0, 120),
        enabled: false,
        isDefault: false,
        phoneDisplay: '',
        phoneTel: '',
        email: '',
        workHours: '',
        postalCode: '',
        streetAddress: '',
        addressLine: '',
        latitude: null,
        longitude: null,
        messengers: [],
        deliveryLocalities: [],
        installmentTerms: DEFAULT_INSTALLMENT_TERMS,
        hasPickup: false,
        hasDelivery: false,
        aboutParagraphs: [],
        faq: [],
        sortOrder: count,
      },
    });

    revalidateTag('cities');
    return NextResponse.json({ ok: true, slug });
  } catch (error) {
    if (error.message === 'Unauthorized' || String(error.message).includes('Forbidden')) {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
    }
    console.error('POST city:', error);
    const missingColumn = /column .* does not exist/i.test(String(error?.message || ''));
    return NextResponse.json(
      {
        error: missingColumn
          ? 'Сначала примените миграцию городов: npx prisma migrate deploy'
          : 'Не удалось добавить город',
      },
      { status: 500 },
    );
  }
}
