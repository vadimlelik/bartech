import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Typography, Box, Grid } from '@mui/material';
import { ShopPage, ShopSurface } from '@/shared/ui/shop-page/ShopPage';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import {
  ServiceAddressBlock,
  ServiceEmailBlock,
  ServiceHoursBlock,
  ServicePhoneBlock,
} from '@/entities/locality/ui/ServiceContactDetails';
import { getBreadcrumbSchema, getLocalBusinessSchema, getOrganizationSchema, clampMeta } from '@/shared/lib/seo';
import { JsonLd } from '@/shared/ui/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { getPageCity } from '@/entities/city/model/cities';
import { DEFAULT_CITY_SLUG, withCityPrefix } from '@/shared/config/city-routes';
import { buildRegionalContactsCopy } from '@/shared/lib/city-seo';
import { cityAddressLine, cityCall, cityWorkHours } from '@/entities/city/lib/city-content';

export async function generateMetadata() {
  const city = await getPageCity();
  if (!city) {
    return { title: 'Страница не найдена', robots: { index: false, follow: false } };
  }
  const prefix = city.slug !== DEFAULT_CITY_SLUG ? `/${city.slug}` : '';
  const nameIn = city.nameIn || 'Минске';
  const regional = city.slug === DEFAULT_CITY_SLUG ? null : buildRegionalContactsCopy(city);
  const title = regional ? regional.title : `Контакты Технобар в ${nameIn} — ООО «Баратех»`;
  const phone = cityCall(city);
  const address = cityAddressLine(city);
  const hours = cityWorkHours(city);
  const description = clampMeta(
    regional
      ? regional.description
      : `Контакты Технобар в ${nameIn}. ${address}. ${phone?.display || ''}. ${hours}. ООО «Баратех», УНП 193796252.`,
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${siteUrl}${prefix}/contacts` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${prefix}/contacts`,
      type: 'website',
      locale: 'ru_BY',
      siteName: 'Технобар',
    },
  };
}

export default async function Contacts() {
  const city = await getPageCity();
  if (!city) notFound();
  const localBusinessSchema = getLocalBusinessSchema(city);
  const homeHref = withCityPrefix(city?.slug, '/');
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Главная', url: homeHref },
    { name: 'Контакты', url: withCityPrefix(city?.slug, '/contacts') },
  ]);
  const title = city && city.slug !== DEFAULT_CITY_SLUG
    ? `Контакты в ${city.nameIn || city.name}`
    : 'Контакты в Минске';
  return (
    <>
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ShopPage
        showInfoNav
        title={title}
        breadcrumbs={[
          { href: homeHref, label: 'Главная' },
          { label: 'Контакты' },
        ]}
      >
        <ShopSurface>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Компания</Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 1, pl: 5 }}>
                  ООО «Баратех»
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, pl: 5 }}>
                  УНП: 193796252
                </Typography>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  <Link href={withCityPrefix(city?.slug, '/reviews')}>Отзывы покупателей</Link>
                </Typography>
              </Box>
              <ServiceAddressBlock />
              <ServiceHoursBlock />
            </Grid>

            <Grid item xs={12} md={6}>
              <ServicePhoneBlock />
              <ServiceEmailBlock />
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceIcon
                    color="primary"
                    sx={{ fontSize: 30, mr: 2 }}
                  />
                  <Typography variant="h6">
                    Органы, осуществляющие контроль за деятельностью
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  +375 17 318-13-33; +375 17 360-82-11 – администрация
                  Советского района г. Минска, отдел торговли
                  <br />
                  Адрес: г. Минск, ул. Дорошевича, 8
                  <br />
                  Электронный адрес: sovadm@minsk.gov.by
                  <br />
                  +375 17 218-00-82 – главное управление торговли и услуг
                  Мингорисполкома
                  <br />
                  Лицо, уполномоченное рассматривать обращения покупателей о
                  нарушении их прав, предусмотренных законодательством о защите
                  прав потребителей, – специалист отдела рекламаций, контактный
                  телефон +375 44 741-84-23
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </ShopSurface>
      </ShopPage>
    </>
  );
}
