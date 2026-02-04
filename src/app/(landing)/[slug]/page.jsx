import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import LandingPageTemplate from '@/components/landing/LandingPageTemplate';
import { getAllLandings, getLandingBySlug } from '@/lib/landings-supabase';

// Кэшируем запросы к Supabase на 1 минуту (60 секунд)
// Это снизит количество запросов к Supabase, но позволит видеть изменения быстрее
const getCachedLandingBySlug = unstable_cache(
  async (slug) => {
    return await getLandingBySlug(slug);
  },
  ['landing-by-slug'],
  {
    revalidate: 60, // Кэш на 1 минуту
    tags: ['landings'],
  }
);

// Настройка кэширования страницы - обновляем каждую минуту
// В development режиме Next.js автоматически отключает кэш
export const revalidate = 60;

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
