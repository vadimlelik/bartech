import { notFound } from 'next/navigation';
import Phone2Theme from './themes/Phone2Theme';
import Phone3Theme from './themes/Phone3Theme';
import Phone4Theme from './themes/Phone4Theme';
import UniversalTheme from './themes/UniversalTheme';
import { getLandingPageBySlug } from '@/lib/landing-supabase';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bartech.by';

function toAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return `${SITE_URL}/${url}`;
}

function stripHtml(input) {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(input, maxLen) {
  const s = stripHtml(input);
  if (!s) return '';
  if (s.length <= maxLen) return s;
  return `${s.slice(0, maxLen - 1).trim()}…`;
}

function buildLandingSeoFallback(landingPage) {
  const content = landingPage?.content || {};
  const rawName =
    content.h1 ||
    content.heroTitle ||
    content.title ||
    landingPage?.title ||
    landingPage?.slug ||
    'Техника';

  const name = stripHtml(rawName);

  const basePhrases = [
    'купить в рассрочку',
    'в рассрочку без переплат',
    'без переплат',
    'без первого взноса',
    'с доставкой',
    'Минск',
    'Беларусь',
    'Bartech',
  ];

  const title = truncate(`Купить ${name} в рассрочку без переплат`, 60) || 'Купить в рассрочку без переплат';

  const description =
    truncate(
      content.description ||
        `${name} в рассрочку без переплат и без первого взноса. Доставка по Минску и Беларуси, гарантия. Оставьте заявку — подберём лучший вариант.`,
      160
    ) ||
    'Купить в рассрочку без переплат. Доставка по Минску и Беларуси. Гарантия. Оставьте заявку — подберём лучший вариант.';

  const keywords = Array.from(
    new Set([name, ...basePhrases].filter(Boolean).map((x) => String(x).trim()).filter(Boolean))
  ).join(', ');

  return { title, description, keywords };
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) return {};

  const landingPage = await getLandingPageBySlug(slug);
  if (!landingPage) {
    return {
      title: 'Страница не найдена',
      robots: { index: false, follow: false },
    };
  }

  const content = landingPage?.content || {};
  const seo = content?.seo || {};
  const fallback = buildLandingSeoFallback(landingPage);

  const title = seo.metaTitle || landingPage.title || content.title || fallback.title || slug;
  const description = seo.metaDescription || content.description || fallback.description || '';
  const canonical = toAbsoluteUrl(seo.canonical || `/${landingPage.slug}`);

  const ogImage = toAbsoluteUrl(
    seo.ogImage ||
      seo.openGraphImage ||
      content.heroImage ||
      (Array.isArray(landingPage.images) ? landingPage.images[0] : null)
  );

  const noindex = Boolean(seo.noindex);
  const nofollow = Boolean(seo.nofollow);

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: canonical || toAbsoluteUrl(`/${landingPage.slug}`),
      siteName: 'Bartech',
      type: 'website',
      locale: 'ru_RU',
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: seo.twitterTitle || seo.ogTitle || title,
      description: seo.twitterDescription || seo.ogDescription || description,
      images: ogImage ? [ogImage] : [],
    },
    keywords: seo.keywords || fallback.keywords || undefined,
  };
}

function getFaqSchema(faqItems) {
  const items = Array.isArray(faqItems) ? faqItems : [];
  const valid = items.filter((x) => x && x.question && x.answer);
  if (valid.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((x) => ({
      '@type': 'Question',
      name: x.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: x.answer,
      },
    })),
  };
}

function StructuredData({ landingPage }) {
  const content = landingPage?.content || {};
  const schemas = [getOrganizationSchema(), getWebSiteSchema(), getFaqSchema(content.faq)].filter(Boolean);

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export default async function DynamicLandingPage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  const landingPage = await getLandingPageBySlug(slug);
  if (!landingPage) notFound();

  let ThemeComponent = null;
  switch (landingPage.theme) {
    case 'phone2':
      ThemeComponent = Phone2Theme;
      break;
    case 'phone3':
      ThemeComponent = Phone3Theme;
      break;
    case 'phone4':
      ThemeComponent = Phone4Theme;
      break;
    case 'universal4':
      ThemeComponent = UniversalTheme;
      break;
    default:
      ThemeComponent = null;
  }

  if (!ThemeComponent) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Неизвестная тема</h1>
        <p>Тема "{landingPage.theme}" не поддерживается</p>
      </div>
    );
  }

  return (
    <>
      <StructuredData landingPage={landingPage} />
      <ThemeComponent landingPage={landingPage} />
    </>
  );
}
