import HeroSection from "../sections/HeroSection";
import BenefitsSection from "../sections/BenefitsSection";
import FeaturesSection from "../sections/FeaturesSection";
import Header from "@/sections/ Header";
import ProblemsSection from "@/sections/ProblemsSection";
import SolutionsSection from "@/sections/SolutionsSection";
import HowItWorksSection from "@/sections/HowItWorksSection";
import CallToActionSection from "@/sections/CallToActionSection";
import Footer from "@/sections/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <ProblemsSection />
      <SolutionsSection />
      <HowItWorksSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default HomePage;
