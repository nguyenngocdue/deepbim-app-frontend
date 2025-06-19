import StepWorkExperience from "./components/StepWorkExperience";
import { IntroSection } from "./components/IntroSection";
import { ProjectSection } from "./components/ProjectSection";
import { SkillSection } from "./components/SkillSection";
import Header from "@/sections/ Header";
import ThankYouNote from "./components/ThankYouNote";
import ParticlesContainer from "@/components/ParticlesContainer";
import I18nClientProvider from "@/features/bim-viewer3/i18n-client-provider";
import { I18nProvider } from "@/context/i18n-context";
export default function PortfolioJill() {
  return (
    <div className="relative z-10 min-h-screen bg-background text-zinc-800 dark:text-zinc-100 px-4 py-6 space-y-16 transition-colors duration-500">
      <I18nClientProvider>
        <I18nProvider>
          <Header />
          <ParticlesContainer />
          <IntroSection />
          <StepWorkExperience />
          <ProjectSection />
          <SkillSection />
          <ThankYouNote />
        </I18nProvider>
      </I18nClientProvider>
    </div>
  );
}



