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
import Header from '@/sections/ Header';
import { CLASS_NAME_DEFAULT } from '@/utils/class';
import ParticlesContainer from '@/components/ParticlesContainer';


const HomePage: React.FC = () => {
  useScrollRestoration();

  return (
    <div className="bg-behind">
          {/* <ParticlesContainer/> */}
      <LanguageProvider>
        <div className={CLASS_NAME_DEFAULT.CLASS_NAME_3}>
          <Header/>
          <HeroSection />
          <SectionWrapper>
            <BenefitsSection />
          </SectionWrapper>

          <SectionWrapper>
            <FeaturesSection />
          </SectionWrapper>

          <SectionWrapper>
            <ProblemsSection />
          </SectionWrapper>

          <SectionWrapper>
            <SolutionsSection />
          </SectionWrapper>

          <SectionWrapper>
            <HowItWorksSection />
          </SectionWrapper>

        </div>
        <CallToActionSection />
      </LanguageProvider>
      <Footer />
    </div>
  );
};

export default HomePage;
