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

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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

      <SectionWrapper>
        <CallToActionSection />
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default HomePage;
