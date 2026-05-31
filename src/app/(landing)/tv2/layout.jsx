import { buildLandingLayoutMetadata } from '@/shared/lib/landing-seo';

export const metadata = buildLandingLayoutMetadata('tv2');

export default function Layout({ children }) {
  return children;
}
