import Footer from '@/shared/ui/footer/Footer';

export default function LandingLayout({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      {children}
      <Footer />
    </div>
  );
}
