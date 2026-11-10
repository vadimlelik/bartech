import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { bannerPublicHref } from '@/entities/city/lib/banners';

export default function CityBannerStrip({ banners = [], citySlug = 'minsk', knownSlugs = [] }) {
  if (!banners.length) return null;

  return (
    <Box component="aside" aria-label="Акции города" sx={{ bgcolor: '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
      <Container sx={{ py: 1.25, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {banners.map((banner) => {
          const href = bannerPublicHref(banner.href, citySlug, knownSlugs);
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
          if (!href) {
            return <Box key={banner.id}>{content}</Box>;
          }
          const external = /^https?:/i.test(href);
          return (
            <Box
              key={banner.id}
              component={external ? 'a' : Link}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              sx={{
                color: '#1D6FE8',
                textDecoration: 'underline',
                width: 'fit-content',
                '&:hover': { color: '#1558b8' },
              }}
            >
              {content}
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}