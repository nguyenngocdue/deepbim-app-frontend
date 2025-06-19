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
import Header from '@/sections/ Header';
import { CLASS_NAME_DEFAULT } from '@/utils/class';
import ParticlesContainer from '@/components/ParticlesContainer';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import CustomerChat from '@/features/chats/chat-customer';
import ScrollToTopButton from '@/components/common/ScrollToTopButton';
import I18nClientProvider from '@/features/bim-viewer3/i18n-client-provider';
import { I18nProvider } from '@/context/i18n-context';

interface HomePageProps {
  onReady: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onReady }) => {
  useScrollRestoration();
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onReady();
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="bg-behind">
      <div className="relative z-10">
        <ParticlesContainer />
        {/* <LanguageProvider> */}

            <I18nClientProvider>
                  <I18nProvider>
                      <div className={CLASS_NAME_DEFAULT.CLASS_NAME_3}>
                        <Header />
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
                  </I18nProvider>
            </I18nClientProvider>
        {/* </LanguageProvider> */}
      </div>
      <ScrollToTopButton />
      <Footer />
      <CustomerChat />
    </div>
  );
};

export default HomePage;
