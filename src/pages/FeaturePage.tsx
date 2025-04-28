import useScrollRestoration from '@/hooks/useScrollRestoration';
import SectionWrapper from '@/components/SectionWrapper';
import FeaturesSection from '@/sections/FeaturesSection';
import BenefitsSection from '@/sections/BenefitsSection';
import HeroSection from '@/sections/HeroSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import { CLASS_NAME_DEFAULT } from '@/utils/class';


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