import { Box, Typography } from '@mui/material';
import { cityFaqItems, describeDelivery } from '@/entities/city/lib/city-content';

export default function CityOfferBlock({ city }) {
  if (!city || city.isDefault || city.slug === 'minsk') return null;

  const paragraphs = (city.aboutParagraphs || []).map((item) => String(item).trim()).filter(Boolean);
  const delivery = describeDelivery(city);
  const pickups = (city.pickupPoints || []).filter((point) => point.address);
  const faq = cityFaqItems(city);
  if (!paragraphs.length && !delivery && !pickups.length && !faq.length) return null;

  const nameIn = city.nameIn || city.name;

  return (
    <Box component="section" aria-label={`Условия в ${nameIn}`} sx={{ maxWidth: 900 }}>
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
        Доставка и получение в {nameIn}
      </Typography>
      {paragraphs.map((paragraph) => (
        <Typography key={paragraph.slice(0, 48)} variant="body1" sx={{ mb: 1.5 }}>
          {paragraph}
        </Typography>
      ))}
      {delivery ? (
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          {delivery}
        </Typography>
      ) : null}
      {pickups.length > 0 ? (
        <Box component="ul" sx={{ mt: 0, mb: 2, pl: 2.5 }}>
          {pickups.map((point) => (
            <Typography component="li" key={point.id || point.address} variant="body1">
              {point.title ? `${point.title}: ` : ''}
              {point.address}
              {point.hours ? `. ${point.hours}` : ''}
            </Typography>
          ))}
        </Box>
      ) : null}
      {faq.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
            Вопросы о заказе в {nameIn}
          </Typography>
          {faq.map((item) => (
            <Box key={item.q} sx={{ mb: 1.5 }}>
              <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
                {item.q}
              </Typography>
              <Typography variant="body1">{item.a}</Typography>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
