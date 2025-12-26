import { notFound } from 'next/navigation';
import LandingPageTemplate from '@/components/landing/LandingPageTemplate';
import { getLandingBySlug } from '@/lib/landings-supabase';

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    const landing = await getLandingBySlug(slug);

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
    const landing = await getLandingBySlug(slug);

    if (!landing) {
      notFound();
    }

    return <LandingPageTemplate landing={landing} />;
  } catch (error) {
    console.error('Error loading landing:', error);
    notFound();
  }
}

