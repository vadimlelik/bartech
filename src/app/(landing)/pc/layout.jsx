import { buildLandingLayoutMetadata } from '@/shared/lib/landing-seo';

export const metadata = buildLandingLayoutMetadata('pc');

export default function Layout({ children }) {
  return children;
}
