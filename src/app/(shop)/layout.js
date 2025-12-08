import ComparePanel from '@/components/ComparePanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShopCookieConsent from '@/components/ShopCookieConsent';

export default function ShopLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <ComparePanel />
      <Footer />
      <ShopCookieConsent />
    </>
  );
}
