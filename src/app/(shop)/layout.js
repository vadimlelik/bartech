import ComparePanel from '@/widgets/compare/ui/ComparePanel';
import Header from '@/widgets/shop-header/ui/Header';
import Footer from '@/widgets/shop-footer/ui/Footer';

export default function ShopLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <ComparePanel />
      <Footer />
    </>
  );
}
