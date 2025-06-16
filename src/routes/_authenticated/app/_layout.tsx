import ScrollToTopButton from '@/components/common/ScrollToTopButton';
import ParticlesContainer from '@/components/ParticlesContainer';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/sections/ Header';
import CallToActionSection from '@/sections/CallToActionSection';
import Footer from '@/sections/Footer';
import { CLASS_NAME_DEFAULT } from '@/utils/class';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute('/_authenticated/app/_layout')({
  component: () => (
    <div className="max-h-screen">
      <div className="relative z-10">
        <ParticlesContainer />
        <LanguageProvider>
          <div className={CLASS_NAME_DEFAULT.CLASS_NAME_3}>
            <Header />
            <Outlet />
          </div>
          <ScrollToTopButton />
          <CallToActionSection />
          <div className='sm:p-0 pb-12'>
            <Footer />
          </div>
        </LanguageProvider>
      </div>
    </div>
  ),
});
