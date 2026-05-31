import { buildLandingLayoutMetadata } from '@/shared/lib/landing-seo';

export const metadata = buildLandingLayoutMetadata('scooter');

export default function Layout({ children }) {
  return children;
}
