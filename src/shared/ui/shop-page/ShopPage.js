import Link from 'next/link';
import { Box, Container, Paper, Typography } from '@mui/material';
import InfoNav from '@/shared/ui/info-nav/InfoNav';

export const shopTitleSx = {
  fontWeight: 700,
  fontSize: { xs: '1.75rem', md: '2.125rem' },
  letterSpacing: 0,
  lineHeight: 1.25,
  mb: 2,
  color: '#1F2933',
};

export const shopSurfaceSx = {
  bgcolor: '#fff',
  borderRadius: '12px',
  border: '1px solid #E1E5EB',
  boxShadow: 'none',
};

export function ShopBreadcrumbs({ items = [] }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mb: 2,
        color: 'text.secondary',
        fontSize: '0.95rem',
      }}
    >
      {items.map((item, index) => {
        const label = item.label || item.name;
        const href = item.href || item.url;
        const isCurrent = index === items.length - 1 || !href;
        return (
          <Box key={`${label}-${index}`} sx={{ display: 'flex', gap: 1 }}>
            {index > 0 ? <span>/</span> : null}
            {isCurrent ? (
              <Typography component="span" color="text.primary" sx={{ fontWeight: 600 }}>
                {label}
              </Typography>
            ) : (
              <Link href={href}>{label}</Link>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export function ShopSurface({ children, sx }) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, ...shopSurfaceSx, ...sx }}>
      {children}
    </Paper>
  );
}

export function ShopPage({
  title,
  description,
  breadcrumbs,
  children,
  maxWidth = 'lg',
  showInfoNav = false,
}) {
  return (
    <Box component="main" sx={{ flex: 1 }}>
      <Container maxWidth={maxWidth} sx={{ py: { xs: 3, md: 5 } }}>
        {showInfoNav ? <InfoNav /> : null}
        {breadcrumbs?.length ? <ShopBreadcrumbs items={breadcrumbs} /> : null}
        {title ? (
          <Typography component="h1" sx={{ ...shopTitleSx, mb: description ? 1 : 3 }}>
            {title}
          </Typography>
        ) : null}
        {description ? (
          <Typography color="text.secondary" className="shop-prose" sx={{ mb: 3 }}>
            {description}
          </Typography>
        ) : null}
        {children}
      </Container>
    </Box>
  );
}
