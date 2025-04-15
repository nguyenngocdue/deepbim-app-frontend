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
import { setCurentUser } from '@/store/slices/AuthSlice';
import { GuestAccessPanel } from '@/components/GuestAccessPanel';

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

  useEffect(() => {
    async function loadUserProfile() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        dispatch(setCurentUser(null));
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
        dispatch(setCurentUser(null));
      } finally {
        setIsLoading(false);
      }
    }
  
    loadUserProfile();
  }, [dispatch]);
  

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageProvider>
        <Header/>
        <div className='realative'>
          {!user && (
              <GuestAccessPanel
                message="Bạn đang dùng chế độ khách. Đăng nhập để truy cập các chức năng nâng cao."
                actionText="Đăng nhập"
                onAction={() => navigate({ to: '/sign-in' })}
                className=" mt-14 w-full"
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
