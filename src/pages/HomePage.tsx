import HeroSection from "../sections/HeroSection";
import BenefitsSection from "../sections/BenefitsSection";
import FeaturesSection from "../sections/FeaturesSection";
import ProblemsSection from "@/sections/ProblemsSection";
import SolutionsSection from "@/sections/SolutionsSection";
import HowItWorksSection from "@/sections/HowItWorksSection";
import CallToActionSection from "@/sections/CallToActionSection";
import Footer from "@/sections/Footer";

import SectionWrapper from "@/components/SectionWrapper"; 
import Header from "@/sections/ Header";
import { LanguageProvider } from "@/context/LanguageContext";
import useScrollRestoration from "@/hooks/useScrollRestoration";


const HomePage = () => {
  useScrollRestoration(); // Activate scroll restoration
  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageProvider>
        <Header />
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
