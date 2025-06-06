import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import StepWorkExperience from "./components/StepWorkExperience";
import { IntroSection } from "./components/IntroSection";
import { ProjectSection } from "./components/ProjectSection";
import { SkillSection } from "./components/SkillSection";
import Header from "@/sections/ Header";
export default function PortfolioJill() {
  return (
    <div className="min-h-screen bg-background text-zinc-800 dark:text-zinc-100 px-4 py-10 space-y-16 transition-colors duration-500">
      <Header />
      <IntroSection />
      <StepWorkExperience />
      <ProjectSection />
      <SkillSection />
    </div>
  );
}



