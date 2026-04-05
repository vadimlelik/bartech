import { prisma } from '@/shared/lib/prisma';

function normalizeLanding(landing) {
  if (!landing) return null;

  return {
    id: landing.id,
    slug: landing.slug,
    title: landing.title,
    main_title: landing.mainTitle,
    description: landing.description,
    main_image: landing.mainImage,
    secondary_image: landing.secondaryImage,
    benefits: landing.benefits || [],
    advantages: landing.advantages || [],
    reviews: landing.reviews || [],
    pixels: landing.pixels || [],
    button_text: landing.buttonText,
    survey_text: landing.surveyText,
    colors: landing.colors || {},
    styles: landing.styles || {},
    is_active: landing.isActive,
    created_at: landing.createdAt,
    updated_at: landing.updatedAt,
  };
}

export async function getAllLandings() {
  const landings = await prisma.landing.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return landings.map(normalizeLanding);
}

export async function getLandingBySlug(slug) {
  if (!slug) return null;

  const landing = await prisma.landing.findFirst({
    where: { slug, isActive: true },
  });
  return normalizeLanding(landing);
}

export async function getLandingById(id) {
  if (!id) return null;
  const landing = await prisma.landing.findUnique({
    where: { id: Number(id) },
  });
  return normalizeLanding(landing);
}

function landingCreateData(landingData) {
  return {
    slug: landingData.slug,
    title: landingData.title,
    mainTitle: landingData.main_title || null,
    description: landingData.description || null,
    mainImage: landingData.main_image || null,
    secondaryImage: landingData.secondary_image || null,
    benefits: landingData.benefits ?? [],
    advantages: landingData.advantages ?? [],
    reviews: landingData.reviews ?? [],
    pixels: landingData.pixels ?? [],
    buttonText: landingData.button_text || 'Узнать цену',
    surveyText: landingData.survey_text || null,
    colors: landingData.colors ?? {},
    styles: landingData.styles ?? {},
    isActive:
      landingData.is_active !== undefined ? Boolean(landingData.is_active) : true,
  };
}

export async function upsertLanding(landingData) {
  try {
    if (!landingData?.slug || !landingData?.title) {
      return { success: false, error: 'Slug and title are required' };
    }

    const data = landingCreateData(landingData);
    const idRaw = landingData.id;
    const idNum =
      idRaw !== undefined && idRaw !== null && idRaw !== ''
        ? Number(idRaw)
        : null;

    if (idNum !== null && !Number.isNaN(idNum)) {
      const existing = await prisma.landing.findUnique({ where: { id: idNum } });
      if (existing) {
        const updated = await prisma.landing.update({
          where: { id: idNum },
          data: {
            slug: data.slug,
            title: data.title,
            mainTitle: data.mainTitle,
            description: data.description,
            mainImage: data.mainImage,
            secondaryImage: data.secondaryImage,
            benefits: data.benefits,
            advantages: data.advantages,
            reviews: data.reviews,
            pixels: data.pixels,
            buttonText: data.buttonText,
            surveyText: data.surveyText,
            colors: data.colors,
            styles: data.styles,
            isActive: data.isActive,
          },
        });
        return { success: true, landing: normalizeLanding(updated) };
      }

      const created = await prisma.landing.create({
        data: { id: idNum, ...data },
      });
      return { success: true, landing: normalizeLanding(created) };
    }

    const row = await prisma.landing.upsert({
      where: { slug: data.slug },
      create: data,
      update: {
        title: data.title,
        mainTitle: data.mainTitle,
        description: data.description,
        mainImage: data.mainImage,
        secondaryImage: data.secondaryImage,
        benefits: data.benefits,
        advantages: data.advantages,
        reviews: data.reviews,
        pixels: data.pixels,
        buttonText: data.buttonText,
        surveyText: data.surveyText,
        colors: data.colors,
        styles: data.styles,
        isActive: data.isActive,
      },
    });

    return { success: true, landing: normalizeLanding(row) };
  } catch (error) {
    if (error?.code === 'P2002') {
      return { success: false, error: 'Лендинг с таким slug или id уже существует' };
    }
    return { success: false, error: error.message || 'Failed to upsert landing' };
  }
}

export async function createLanding(landingData) {
  try {
    if (!landingData?.slug || !landingData?.title) {
      return { success: false, error: 'Slug and title are required' };
    }

    const created = await prisma.landing.create({
      data: landingCreateData(landingData),
    });

    return { success: true, landing: normalizeLanding(created) };
  } catch (error) {
    if (error?.code === 'P2002') {
      return { success: false, error: 'Лендинг с таким slug уже существует' };
    }
    return { success: false, error: error.message || 'Failed to create landing' };
  }
}

export async function updateLanding(id, landingData) {
  try {
    if (!id) return { success: false, error: 'Landing ID is required' };

    const updated = await prisma.landing.update({
      where: { id: Number(id) },
      data: {
        slug: landingData.slug ?? undefined,
        title: landingData.title ?? undefined,
        mainTitle: landingData.main_title ?? undefined,
        description: landingData.description ?? undefined,
        mainImage: landingData.main_image ?? undefined,
        secondaryImage: landingData.secondary_image ?? undefined,
        benefits: landingData.benefits ?? undefined,
        advantages: landingData.advantages ?? undefined,
        reviews: landingData.reviews ?? undefined,
        pixels: landingData.pixels ?? undefined,
        buttonText: landingData.button_text ?? undefined,
        surveyText: landingData.survey_text ?? undefined,
        colors: landingData.colors ?? undefined,
        styles: landingData.styles ?? undefined,
        isActive:
          landingData.is_active !== undefined ? Boolean(landingData.is_active) : undefined,
      },
    });

    return { success: true, landing: normalizeLanding(updated) };
  } catch (error) {
    if (error?.code === 'P2002') {
      return { success: false, error: 'Лендинг с таким slug уже существует' };
    }
    if (error?.code === 'P2025') {
      return { success: false, error: 'Landing not found' };
    }
    return { success: false, error: error.message || 'Failed to update landing' };
  }
}

export async function deleteLanding(id) {
  try {
    if (!id) return { success: false, error: 'Landing ID is required' };

    await prisma.landing.delete({ where: { id: Number(id) } });
    return { success: true };
  } catch (error) {
    if (error?.code === 'P2025') {
      return { success: false, error: 'Landing not found' };
    }
    return { success: false, error: error.message || 'Failed to delete landing' };
  }
}


