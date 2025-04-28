import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/sections/ Header';
import CallToActionSection from '@/sections/CallToActionSection';
import Footer from '@/sections/Footer';
import { Outlet } from '@tanstack/react-router';
import { createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="max-h-screen">
      <LanguageProvider>
        <Header />
          <Outlet />
        <CallToActionSection />
        <Footer />
      </LanguageProvider>
    </div>
  ),
});
