import {
    Briefcase,
    LucideCheck,
    LucideClock,
    LucideLoader2,
    LucideSparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { GiRun, GiRunningNinja } from "react-icons/gi";
import { RiRunFill } from "react-icons/ri";
import { FaRunning } from "react-icons/fa";
import { SectionTitle } from "./SectionTitle";
import { LiaRunningSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";


function StepWorkExperience() {
    const { t } = useTranslation("translation");

    const workSteps = [
    {
        title: t("personal_cv.work_steps.0.title"),
        description: t("personal_cv.work_steps.0.description"),
    },
    {
        title: t("personal_cv.work_steps.1.title"),
        description: t("personal_cv.work_steps.1.description"),
    },
    {
        title: t("personal_cv.work_steps.2.title"),
        description: t("personal_cv.work_steps.2.description"),
    },
    {
        title: t("personal_cv.work_steps.3.title"),
        description: t("personal_cv.work_steps.3.description"),
    },
    {
        title: t("personal_cv.work_steps.4.title"),
        description: t("personal_cv.work_steps.4.description"),
    },
    ];
    const [progress, setProgress] = useState(0);
    const [runnerIndex, setRunnerIndex] = useState(0);
    const [lastStep, setLastStep] = useState(-1);
    const [celebrate, setCelebrate] = useState(false);
    const iconRefs = useRef<HTMLElement[]>([]);
    const svgRef = useRef<SVGSVGElement>(null);
    const randomOffsets = useRef<number[]>([]);
    const [runnerPos, setRunnerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const runnerIcons = [
        <LiaRunningSolid className="text-green-500 dark:text-green-200" key="3" />,
        <GiRunningNinja className=" text-green-600 dark:text-green-300" key="4" />,
        // <BiRun className=" text-gray-800 dark:text-gray-500" key="5" />,
        <RiRunFill className="text-zinc-800 dark:text-blue-400" key="0" />,
        <GiRun className="text-indigo-900 dark:text-indigo-600" key="1" />,
        <FaRunning className="text-orange-800 dark:text-orange-300" key="2" />,
    ];


    useEffect(() => {
        if (randomOffsets.current.length === 0) {
            randomOffsets.current = workSteps.map(() => Math.floor(Math.random() * 80) - 40);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev + 1) % (workSteps.length * 20));
        }, 150);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const toggleRunner = setInterval(() => {
            setRunnerIndex((prev) => (prev + 1) % runnerIcons.length);
        }, 600);
        return () => clearInterval(toggleRunner);
    }, []);

    const percent = (progress % (workSteps.length * 20)) / (workSteps.length * 20);
    const currentStep = Math.floor(percent * workSteps.length);

    useEffect(() => {
        if (currentStep !== lastStep) {
            setLastStep(currentStep);
            setCelebrate(true);
            setTimeout(() => setCelebrate(false), 1000);
        }
    }, [currentStep, lastStep]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("path").remove();

        if (!svgRef.current || iconRefs.current.some((ref) => !ref)) return;

        const svgBox = svgRef.current.getBoundingClientRect();
        const points = iconRefs.current.map((ref) => {
            const elBox = ref.getBoundingClientRect();
            return [
                elBox.left + elBox.width / 2 - svgBox.left,
                elBox.top + elBox.height / 2 - svgBox.top,
            ];
        });

        const lineGenerator = d3.line().curve(d3.curveCatmullRom.alpha(0.5));
        const pathData = lineGenerator(points);
        if (!pathData) return;

        const path = svg
            .append("path")
            .attr("d", pathData)
            .attr("fill", "none")
            .attr("stroke", "#6366f1")
            .attr("stroke-width", 2);

        const pathLength = path.node()?.getTotalLength?.();
        if (!pathLength) return;

        const pointAt = path.node().getPointAtLength(pathLength * percent);
        setRunnerPos({ x: pointAt.x, y: pointAt.y });
    }, [progress]);

    return (
        <section className="max-w-6xl mx-auto px-4">
            <SectionTitle
                 title={t("personal_cv.work_experience.title")}
                icon={<Briefcase className="w-6 h-6" />}
                description={t("personal_cv.work_experience.description")}
            />

            <div className="relative pt-16 min-h-[300px]">
                <svg
                    ref={svgRef}
                    className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
                />

                <div
                    className="absolute z-10 text-indigo-900"
                    style={{
                        left: runnerPos.x - 16,
                        top: runnerPos.y - 30,
                        width: 32,
                        height: 32,
                        fontSize: 28,
                    }}
                >
                    {runnerIcons[runnerIndex]}
                </div>

                <div className="flex flex-col md:flex-row items-start justify-between gap-10 relative z-10">
                    {workSteps.map((step, i) => {
                        const isActive = i === currentStep;
                        const isCompleted = i < currentStep;
                        const isNear = i === currentStep - 1 || i === currentStep + 1;

                        return (
                            <div
                                key={i}
                                className="flex flex-col items-center text-center flex-1"
                                style={{ marginTop: `${randomOffsets.current[i]}px` }}
                            >
                                <div
                                    ref={(el) => (iconRefs.current[i] = el!)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl transition-all duration-700
                    ${isCompleted
                                            ? "bg-indigo-500 shadow-indigo-500/50 shadow-xl"
                                            : isActive
                                                ? "bg-yellow-400 animate-pulse"
                                                : "bg-zinc-300 text-zinc-600 opacity-0"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <LucideCheck className="w-5 h-5" />
                                    ) : isActive ? (
                                        <LucideLoader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <LucideClock className="w-5 h-5" />
                                    )}
                                </div>
                                <div
                                    className={`relative bg-white border mt-4 rounded-xl p-4 text-left w-full max-w-xs transition duration-700
                    ${isCompleted || isActive ? "opacity-100" : "opacity-0"}
                    ${isActive || isNear ? "shadow-lg shadow-indigo-400/30" : ""}`}
                                >
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 leading-snug">
                                        {step.description}
                                    </p>
                                    {isActive && celebrate && (
                                        <LucideSparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-bounce" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default StepWorkExperience;
