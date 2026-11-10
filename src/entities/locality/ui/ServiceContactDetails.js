'use client';

import { Box, Link, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { cityAddressLine, cityCall, cityWorkHours } from '@/entities/city/lib/city-content';
import { useServiceCity } from './useServiceCity';

function useContactCity() {
  const city = useServiceCity();
  return {
    phone: cityCall(city),
    address: cityAddressLine(city),
    hours: cityWorkHours(city),
    email: city?.email || 'baratexby@gmail.com',
  };
}

export function ServiceAddressBlock() {
  const { address } = useContactCity();
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocationOnIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
        <Typography variant="h6">Адрес</Typography>
      </Box>
      <Typography variant="body1" sx={{ pl: 5 }}>
        {address || 'Адрес пункта в этом городе не указан.'}
      </Typography>
    </Box>
  );
}

export function ServiceHoursBlock() {
  const { hours } = useContactCity();
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AccessTimeIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
        <Typography variant="h6">Время работы</Typography>
      </Box>
      <Typography variant="body1" sx={{ pl: 5 }}>
        {hours || 'График для этого города не указан.'}
      </Typography>
    </Box>
  );
}

export function ServicePhoneBlock() {
  const { phone } = useContactCity();
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PhoneIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
        <Typography variant="h6">Телефон</Typography>
      </Box>
      {phone ? (
        <Link href={`tel:${phone.tel}`} sx={{ textDecoration: 'none', color: 'text.primary', pl: 5, display: 'block', '&:hover': { color: 'primary.main' } }}>
          <Typography variant="body1">{phone.display}</Typography>
        </Link>
      ) : (
        <Typography variant="body1" sx={{ pl: 5 }}>Телефон для этого города не указан.</Typography>
      )}
    </Box>
  );
}

export function ServiceEmailBlock() {
  const { email } = useContactCity();
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EmailIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
        <Typography variant="h6">Email</Typography>
      </Box>
      <Link href={`mailto:${email}`} sx={{ textDecoration: 'none', color: 'text.primary', pl: 5, display: 'block', '&:hover': { color: 'primary.main' } }}>
        <Typography variant="body1">{email}</Typography>
      </Link>
    </Box>
  );
}
