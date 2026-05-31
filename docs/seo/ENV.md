# Environment variables for SEO

Add to your deployment environment (Vercel, Docker, `.env.local`):

```bash
# Google Search Console — meta tag verification code (content value only)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code-here

# Schema.org sameAs — public profile URLs (optional, improves E-E-A-T)
NEXT_PUBLIC_GOOGLE_MAPS_URL=https://maps.google.com/?q=Texnobar+Минск+Сурганова+43
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your-profile
NEXT_PUBLIC_2GIS_URL=https://2gis.by/minsk/firm/your-firm-id
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_TELEGRAM_URL=

# Canonical site URL (already used)
NEXT_PUBLIC_SITE_URL=https://technobar.by
```

Get the Google code from [Google Search Console](https://search.google.com/search-console) → Add property → HTML tag method → copy the `content="..."` value.
