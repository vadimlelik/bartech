import { buildLandingLayoutMetadata } from '@/shared/lib/landing-seo';

export const metadata = buildLandingLayoutMetadata('phone6');

export default function Layout({ children }) {
  return children;
}
