import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';

export default function CityBannerStrip({ banners = [] }) {
  if (!banners.length) return null;

  return (
    <Box component="aside" aria-label="Акции города" sx={{ bgcolor: '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
      <Container sx={{ py: 1.25, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {banners.map((banner) => {
          const content = (
            <>
              <Typography component="span" sx={{ fontWeight: 700 }}>
                {banner.title}
              </Typography>
              {banner.subtitle ? (
                <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                  {banner.subtitle}
                </Typography>
              ) : null}
            </>
          );
          if (!banner.href) {
            return <Box key={banner.id}>{content}</Box>;
          }
          return (
            <Box key={banner.id} component={Link} href={banner.href} sx={{ color: 'inherit', textDecoration: 'none' }}>
              {content}
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}