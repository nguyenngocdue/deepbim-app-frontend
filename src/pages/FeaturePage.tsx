import useScrollRestoration from '@/hooks/useScrollRestoration';
import SectionWrapper from '@/components/SectionWrapper';
import FeaturesSection from '@/sections/FeaturesSection';
import BenefitsSection from '@/sections/BenefitsSection';
import HeroSection from '@/sections/HeroSection';
import HowItWorksSection from '@/sections/HowItWorksSection';


const FeaturePage: React.FC = () => {
  useScrollRestoration();
  return (
    <>
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
    </>
  );
};

export default FeaturePage;