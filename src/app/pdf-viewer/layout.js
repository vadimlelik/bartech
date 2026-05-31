import { ROBOTS_NOINDEX_FOLLOW } from '@/shared/lib/landing-seo';

export const metadata = {
  title: 'PDF Viewer | Texnobar',
  robots: ROBOTS_NOINDEX_FOLLOW,
};

export default function PdfViewerLayout({ children }) {
  return <div style={{ margin: 0, minHeight: '100vh' }}>{children}</div>;
}
