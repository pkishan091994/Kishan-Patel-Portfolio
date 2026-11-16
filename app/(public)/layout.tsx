import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import NavigationLoader from '@/components/NavigationLoader';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <Navbar />
      <NavigationLoader />
      <PageTransition>
        <main style={{ paddingTop: '68px' }}>
          {children}
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
}
