import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import LandingPageTemplate from '@/components/landing/LandingPageTemplate';
import { getAllLandings, getLandingBySlug } from '@/lib/landings-supabase';

// Кэшируем запросы к Supabase (в проде это напрямую снижает Supabase Cached Egress).
// Обновление данных делаем через on-demand revalidateTag('landings') из админки.
const getCachedLandingBySlug = unstable_cache(
  async (slug) => {
    return await getLandingBySlug(slug);
  },
  ['landing-by-slug'],
  {
    revalidate: 86400, // 24 часа
    tags: ['landings'],
  }
);


export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const landing = await getCachedLandingBySlug(slug);

    if (!landing) {
      return {
        title: 'Лендинг не найден',
        description: 'Лендинг не найден',
      };
    }

    return {
      title: landing.title || 'Лендинг',
      description: landing.description || landing.title || 'Лендинг',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Лендинг',
      description: 'Лендинг',
    };
  }
}

export const generateStaticParams = async () => {
  const landings = await getAllLandings();

  return landings.map((landing) => ({
    slug: landing.slug,
  }));
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
