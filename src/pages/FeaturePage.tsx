import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { LanguageProvider } from '@/context/LanguageContext';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { fetchUserProfile } from '../api';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { clearUser, setCurentUser } from '@/store/slices/AuthSlice';
import { GuestAccessPanel } from '@/components/GuestAccessPanel';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '@/components/SectionWrapper';
import FeaturesSection from '@/sections/FeaturesSection';
import BenefitsSection from '@/sections/BenefitsSection';
import HeroSection from '@/sections/HeroSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import { CLASS_NAME_DEFAULT } from '@/utils/class';

interface UserProfile {
  id: number;
  username: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const FeaturePage: React.FC = () => {
  useScrollRestoration();
  return (
    <>
          <div className={`${CLASS_NAME_DEFAULT.CLASS_NAME_3}`}>
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
          </div>
    </>
  );
};

export default FeaturePage;