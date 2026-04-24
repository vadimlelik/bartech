import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import LandingPageTemplate from '@/widgets/landing-page/ui/LandingPageTemplate';
import { getAllLandings, getLandingBySlug } from '@/entities/landing/model/landings-db';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

// Кэш по каждому slug отдельно (ключ БЕЗ slug ломал все URL: возвращался первый закэшированный результат).
// Обновление: revalidateTag('landings') из админки.
async function getCachedLandingBySlug(slug) {
  if (!slug) return null;
  return unstable_cache(
    async () => getLandingBySlug(slug),
    ['landing-by-slug', slug],
    {
      revalidate: 86400,
      tags: ['landings'],
    }
  )();
}

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const landing = await getCachedLandingBySlug(slug);

    if (!landing) {
      const notFoundTitle = 'Лендинг не найден';
      const notFoundDescription = 'Запрошенная страница не найдена';
      return {
        title: notFoundTitle,
        description: notFoundDescription,
        robots: {
          index: false,
          follow: false,
        },
        openGraph: {
          title: notFoundTitle,
          description: notFoundDescription,
          url: siteUrl,
          type: 'website',
        },
        twitter: {
          card: 'summary',
          title: notFoundTitle,
          description: notFoundDescription,
        },
      };
    }

    const title = landing.title || 'Лендинг';
    const description = landing.description || landing.title || 'Лендинг';
    const url = `${siteUrl}/${slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    const fallbackTitle = 'Лендинг';
    const fallbackDescription = 'Лендинг';
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: siteUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: fallbackTitle,
        description: fallbackDescription,
      },
    };
  }
}

export const generateStaticParams = async () => {
  try {
    const landings = await getAllLandings();
    return landings.map((landing) => ({
      slug: landing.slug,
    }));
  } catch {
    // Сборка без доступной БД (Docker и т.д.) — страницы по slug генерируются on-demand
    return [];
  }
};

export default async function LandingPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // Используем кэшированную версию - данные уже будут в кэше после generateMetadata
    const landing = await getCachedLandingBySlug(slug);

    if (!landing) {
      notFound();
    }

    return <LandingPageTemplate landing={landing} />;
  } catch (error) {
    console.error('Error loading landing:', error);
    notFound();
  }
}
