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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadUserProfile() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate({ to: '/sign-in' });
        return;
      }
      setIsLoading(true);
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch (err: any) {
        console.error(err.message);
        setError(err.message);
        navigate({ to: '/sign-in' });
      } finally {
        setIsLoading(false);
      }
    }
    loadUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate({ to: '/sign-in' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageProvider>
        <Header />
        {isLoading ? (
          <div className="container mx-auto p-4 text-center">Loading...</div>
        ) : user ? (
          <div className="container mx-auto p-4 text-center">
            <h2 className="text-2xl font-semibold">
              Hello, {user.username || 'User'}!
            </h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : error ? (
          <div className="container mx-auto p-4 text-center text-red-500">
            {error}
          </div>
        ) : null}

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
