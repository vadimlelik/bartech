'use client';

import { Box, Grid, Typography } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { showCityField } from '@/entities/city/lib/city-content';
import { useServiceCity } from './useServiceCity';

export default function ServiceDeliveryDetails() {
  const city = useServiceCity();
  const methods = city?.deliveryMethods || [];

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocalShippingIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>Доставка</Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Доставка для города {city?.name || 'Минск'}
          {city?.regionName ? ` и ${city.regionName}` : ''}.
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Стоимость доставки:</Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {showCityField(city, 'freeDelivery') && city?.freeDeliveryFrom ? (
              <Typography component="li" variant="body1">• Бесплатная доставка при заказе от {city.freeDeliveryFrom} BYN</Typography>
            ) : null}
            {showCityField(city, 'minOrder') && city?.minOrderAmount ? (
              <Typography component="li" variant="body1">• Минимальная сумма заказа — {city.minOrderAmount} BYN</Typography>
            ) : null}
            {methods.map((method) => (
              <Typography component="li" variant="body1" key={method.id}>
                • {method.title}: {method.eta}{method.price ? `, ${method.price} BYN` : ', бесплатно'}
              </Typography>
            ))}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccessTimeIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>Сроки доставки</Typography>
        </Box>
        <Box sx={{ pl: 2 }}>
          <Typography variant="body1" paragraph>Сроки доставки зависят от вашего местоположения:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {methods.map((method) => (
              <Typography component="li" variant="body1" key={`eta-${method.id}`}>• {method.title} — {method.eta}</Typography>
            ))}
            {(city?.pickupPoints || []).map((point) => (
              <Typography component="li" variant="body1" key={point.id}>• {point.title}: {point.address}</Typography>
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
