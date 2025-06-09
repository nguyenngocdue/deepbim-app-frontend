import StepWorkExperience from "./components/StepWorkExperience";
import { IntroSection } from "./components/IntroSection";
import { ProjectSection } from "./components/ProjectSection";
import { SkillSection } from "./components/SkillSection";
import Header from "@/sections/ Header";
import ThankYouNote from "./components/ThankYouNote";
import ParticlesContainer from "@/components/ParticlesContainer";
import { LanguageProvider } from "@/context/LanguageContext";
export default function PortfolioJill() {
  return (
    <div className="relative z-10 min-h-screen bg-background text-zinc-800 dark:text-zinc-100 px-4 py-6 space-y-16 transition-colors duration-500">
           <LanguageProvider>
            <Header />
            <ParticlesContainer />
            <IntroSection />
            <StepWorkExperience />
            <ProjectSection />
            <SkillSection />
            <ThankYouNote />
           </LanguageProvider>
      
    </div>
  );
}



