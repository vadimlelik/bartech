import { buildLandingLayoutMetadata } from '@/shared/lib/landing-seo';

export const metadata = buildLandingLayoutMetadata('50discount');

export default function Layout({ children }) {
  return children;
}
