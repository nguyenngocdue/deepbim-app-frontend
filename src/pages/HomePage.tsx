import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import HeroSection from '../sections/HeroSection';
import BenefitsSection from '../sections/BenefitsSection';
import FeaturesSection from '../sections/FeaturesSection';
import ProblemsSection from '@/sections/ProblemsSection';
import SolutionsSection from '@/sections/SolutionsSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import CallToActionSection from '@/sections/CallToActionSection';
import Footer from '@/sections/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import { LanguageProvider } from '@/context/LanguageContext';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { fetchUserProfile } from '../api';
import Header from '@/sections/ Header';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { clearUser, setCurentUser } from '@/store/slices/AuthSlice';
import { GuestAccessPanel } from '@/components/GuestAccessPanel';
import { useTranslation } from 'react-i18next';

interface UserProfile {
  id: number;
  username: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const HomePage: React.FC = () => {
  useScrollRestoration();
  const { navigate } = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
  
      setIsLoading(true);
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        dispatch(setCurentUser(userData));
      } catch (err: any) {
        console.error(err.message);
        setUser(null);
        dispatch(clearUser());
      } finally {
        setIsLoading(false);
      }
    }
  
    loadUserProfile();
  }, [dispatch]);

  
  return (
    <div className="max-h-screen">
      <LanguageProvider>
        <Header/>
        <div className='realative'>
          {!user && (
              <GuestAccessPanel
                message={t("panel_alert.message")}
                actionText={t("panel_alert.action_text")}
                onAction={() => navigate({ to: '/sign-in' })}
                className="absolute mt-14 w-1/2"
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

        <SectionWrapper className="mb-0">
          <ProblemsSection />
        </SectionWrapper>

        <SectionWrapper>
          <SolutionsSection />
        </SectionWrapper>

        <SectionWrapper>
          <HowItWorksSection />
        </SectionWrapper>

        <SectionWrapper className="mb-0">
          <CallToActionSection />
        </SectionWrapper>
      </LanguageProvider>
      <Footer />
    </div>
  );
};

export default HomePage;
