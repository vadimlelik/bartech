import { ROBOTS_NOINDEX_NOFOLLOW } from '@/shared/lib/landing-seo';

export const metadata = {
  title: 'Test | Texnobar',
  robots: ROBOTS_NOINDEX_NOFOLLOW,
};

export default function TestLayout({ children }) {
  return children;
}
