import { Typography, Box } from '@mui/material';
import { ShopPage, ShopSurface } from '@/shared/ui/shop-page/ShopPage';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Условия возврата — Texnobar',
  description:
    'Условия возврата товара в интернет-магазине Texnobar. Возврат в течение 14 дней при сохранении товарного вида и упаковки.',
  alternates: {
    canonical: `${siteUrl}/return`,
  },
};

export default function Return() {
  return (
    <ShopPage
      showInfoNav
      title="Условия возврата"
      description="Товар можно вернуть в течение 14 дней с момента покупки."
      breadcrumbs={[
        { href: '/', label: 'Главная' },
        { label: 'Условия возврата' },
      ]}
    >
      <ShopSurface>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 1.5 }}>
          Порядок возврата
        </Typography>
        <Typography sx={{ mb: 1.5 }}>
          Вы можете вернуть товар в течение 14 дней с момента покупки при соблюдении следующих условий:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          <li>Товар не был в использовании</li>
          <li>Сохранены товарный вид и упаковка</li>
          <li>Имеются все документы о покупке</li>
        </Box>
      </ShopSurface>
    </ShopPage>
  );
}
