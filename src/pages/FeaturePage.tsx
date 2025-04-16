import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { LanguageProvider } from '@/context/LanguageContext';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { fetchUserProfile } from '../api';
import Header from '@/sections/ Header';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { clearUser, setCurentUser } from '@/store/slices/AuthSlice';
import { GuestAccessPanel } from '@/components/GuestAccessPanel';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '@/components/SectionWrapper';
import FeaturesSection from '@/sections/FeaturesSection';
import BenefitsSection from '@/sections/BenefitsSection';
import HeroSection from '@/sections/HeroSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import CallToActionSection from '@/sections/CallToActionSection';
import Footer from '@/sections/Footer';

interface UserProfile {
  id: number;
  username: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const FeaturePage: React.FC = () => {
  useScrollRestoration();
  const { navigate } = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    async function loadUserProfile() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        dispatch(clearUser());
        return;
      }
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        dispatch(setCurentUser(userData));
      } catch (err: any) {
        console.error(err.message);
        setUser(null);
        dispatch(clearUser());
      }
    }

    loadUserProfile();
  }, [dispatch]);

  return (
    <div className="max-h-screen">
      <LanguageProvider>
        <Header />
        <div className='realative'>
          {!user && (
            <GuestAccessPanel
              message={t("panel_alert.message")}
              actionText={t("panel_alert.action_text")}
              onAction={() => navigate({ to: '/sign-in' })}
              dismissable
            />
          )}
        </div>
        <HeroSection />
        <SectionWrapper>
          <BenefitsSection />
        </SectionWrapper>
        <SectionWrapper>
          <FeaturesSection />
        </SectionWrapper>
        <SectionWrapper>
          <HowItWorksSection />
        </SectionWrapper>
        <CallToActionSection />
        <Footer />
      </LanguageProvider>
    </div>
  );
};

export default FeaturePage;
