import { Suspense } from 'react';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import ComparePanel from '@/widgets/compare/ui/ComparePanel';
import Header from '@/widgets/shop-header/ui/Header';
import Footer from '@/widgets/shop-footer/ui/Footer';
import CityAnalytics from '@/shared/ui/analytics/CityAnalytics';
import CityBannerStrip from '@/entities/city/ui/CityBannerStrip';
import { CityProvider } from '@/entities/city';
import { LocalityProvider } from '@/entities/locality/ui/LocalityProvider';
import { getBannersForCity, getPageCityContext } from '@/entities/city/model/cities';
import { getSelectedLocality } from '@/entities/locality/model/localities';
import { getCategories } from '@/entities/category/model/categories';
import { groupStoreCategories } from '@/shared/config/catalog-groups';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Каталог техники и электроники',
  description:
    'Каталог техники Texnobar: смартфоны, ноутбуки, телевизоры и другая электроника с доставкой по Беларуси.',
  openGraph: {
    title: 'Каталог техники и электроники | Texnobar',
    description:
      'Каталог техники Texnobar: смартфоны, ноутбуки, телевизоры и другая электроника.',
    url: siteUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Каталог техники и электроники | Texnobar',
    description:
      'Каталог техники Texnobar: смартфоны, ноутбуки, телевизоры и другая электроника.',
  },
};

export default async function ShopLayout({ children }) {
  const { pageCity, cities, locked } = await getPageCityContext();
  if (!pageCity) {
    notFound();
  }
  const [categories, banners, locality] = await Promise.all([
    getCategories(),
    getBannersForCity(pageCity.slug),
    getSelectedLocality(),
  ]);
  const catalogGroups = groupStoreCategories(categories).map((group) => ({
    slug: group.slug,
    name: group.name,
    categories: group.categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.image || null,
    })),
  }));

  return (
    <CityProvider pageCity={pageCity} cities={cities} lockCityToUrl={locked}>
      <LocalityProvider initialLocality={locality}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <CityAnalytics />
        <Header catalogGroups={catalogGroups} />
        <CityBannerStrip banners={banners} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Suspense fallback={null}>{children}</Suspense>
        </Box>
        <ComparePanel />
        <Footer
          categories={categories
            .filter((category) => category?.id && category?.name)
            .map((category) => ({ id: String(category.id), name: category.name }))}
        />
      </Box>
      </LocalityProvider>
    </CityProvider>
  );
}
