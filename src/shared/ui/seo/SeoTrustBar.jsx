import Link from 'next/link';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import {
  LocationOnOutlined,
  PhoneOutlined,
  StorefrontOutlined,
} from '@mui/icons-material';

const DEFAULT_LINKS = [
  { href: '/contacts', label: 'Контакты' },
  { href: '/guarantee', label: 'Гарантия' },
  { href: '/installment', label: 'Рассрочка' },
  { href: '/payment_delivery', label: 'Доставка' },
];

export default function SeoTrustBar({
  phone = '+375 (25) 776-64-62',
  phoneHref = 'tel:+375257766462',
  address = 'г. Минск, ул. Сурганова, 43',
  company = 'ООО «Баратех»',
  links = DEFAULT_LINKS,
}) {
  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        p: { xs: 2, md: 2.5 },
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <StorefrontOutlined color="primary" fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              Texnobar · {company}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
            >
              <LocationOnOutlined sx={{ fontSize: 16 }} />
              {address}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
          <Chip
            icon={<PhoneOutlined />}
            label={phone}
            component="a"
            href={phoneHref}
            clickable
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {links.map((link) => (
            <Chip
              key={link.href}
              label={link.label}
              component={Link}
              href={link.href}
              clickable
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
