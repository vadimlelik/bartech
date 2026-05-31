import { buildLandingLayoutMetadata } from '@/shared/lib/landing-seo';

export const metadata = buildLandingLayoutMetadata('bicycles');

export default function Layout({ children }) {
  return children;
}
