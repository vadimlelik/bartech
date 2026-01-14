import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import LandingPageTemplate from '@/components/landing/LandingPageTemplate';
import { getLandingBySlug } from '@/lib/landings-supabase';

// Кэшируем запросы к Supabase на 1 час (3600 секунд)
// Это значительно снизит количество запросов к Supabase
const getCachedLandingBySlug = unstable_cache(
  async (slug) => {
    return await getLandingBySlug(slug);
  },
  ['landing-by-slug'],
  {
    revalidate: 3600, // Кэш на 1 час
    tags: ['landings'],
  }
);

// Настройка кэширования страницы - обновляем раз в час
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
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

