import { Typography, Box } from '@mui/material';
import { ShopPage, ShopSurface } from '@/shared/ui/shop-page/ShopPage';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Публичная оферта — Texnobar',
  description:
    'Публичная оферта интернет-магазина Texnobar. Условия договора купли-продажи товаров в рассрочку.',
  alternates: {
    canonical: `${siteUrl}/offer`,
  },
  robots: { index: false, follow: false },
};

export default function Offer() {
  return (
    <ShopPage
      showInfoNav
      title="Публичная оферта"
      breadcrumbs={[
        { href: '/', label: 'Главная' },
        { label: 'Публичная оферта' },
      ]}
    >
      <ShopSurface>
        <Box component="section" sx={{ mb: 4 }}>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 1.5 }}>
            1. Общие положения
          </Typography>
          <Typography>
            Настоящий документ является публичной офертой и содержит все
            существенные условия договора купли-продажи товаров через
            интернет-магазин.
          </Typography>
        </Box>
        <Box component="section">
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 1.5 }}>
            2. Предмет договора
          </Typography>
          <Typography>
            Продавец обязуется передать в собственность Покупателю товар, а
            Покупатель обязуется оплатить и принять товар на условиях настоящего
            Договора.
          </Typography>
        </Box>
      </ShopSurface>
    </ShopPage>
  );
}
