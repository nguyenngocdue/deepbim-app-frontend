import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDarkMode } from "@/hooks/useDarkMode";

// Generate real dates for the past 8 weeks, starting from May 28, 2025
const generateDates = () => {
  const endDate = new Date("2025-05-28"); // Current date: May 28, 2025
  const dates: string[] = [];
  for (let i = 0; i < 8; i++) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (7 - i) * 7 - (endDate.getDay() === 0 ? 6 : endDate.getDay() - 1)); // Adjust to previous Monday
    dates.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" })); // Format: "Apr 7"
  }
  return dates;
};

const dates = generateDates();

export function BIMMultiLineChart() {
  const isDark = useDarkMode();

  // Define bimProgressData directly inside the component
  const bimProgressData = [
    // Structure
    { Week: dates[0], Discipline: "Structure", Percent: 7 }, // Apr 7
    { Week: dates[1], Discipline: "Structure", Percent: 16 }, // Apr 14
    { Week: dates[2], Discipline: "Structure", Percent: 27 }, // Apr 21
    { Week: dates[3], Discipline: "Structure", Percent: 39 }, // Apr 28
    { Week: dates[4], Discipline: "Structure", Percent: 51 }, // May 5
    { Week: dates[5], Discipline: "Structure", Percent: 64 }, // May 12
    { Week: dates[6], Discipline: "Structure", Percent: 75 }, // May 19
    { Week: dates[7], Discipline: "Structure", Percent: 84 }, // May 26

    // Architecture
    { Week: dates[0], Discipline: "Architecture", Percent: 5 }, // Apr 7
    { Week: dates[1], Discipline: "Architecture", Percent: 12 }, // Apr 14
    { Week: dates[2], Discipline: "Architecture", Percent: 22 }, // Apr 21
    { Week: dates[3], Discipline: "Architecture", Percent: 35 }, // Apr 28
    { Week: dates[4], Discipline: "Architecture", Percent: 48 }, // May 5
    { Week: dates[5], Discipline: "Architecture", Percent: 62 }, // May 12
    { Week: dates[6], Discipline: "Architecture", Percent: 71 }, // May 19
    { Week: dates[7], Discipline: "Architecture", Percent: 81 }, // May 26

    // MEP
    { Week: dates[0], Discipline: "MEP", Percent: 2 }, // Apr 7
    { Week: dates[1], Discipline: "MEP", Percent: 7 }, // Apr 14
    { Week: dates[2], Discipline: "MEP", Percent: 13 }, // Apr 21
    { Week: dates[3], Discipline: "MEP", Percent: 20 }, // Apr 28
    { Week: dates[4], Discipline: "MEP", Percent: 29 }, // May 5
    { Week: dates[5], Discipline: "MEP", Percent: 43 }, // May 12
    { Week: dates[6], Discipline: "MEP", Percent: 57 }, // May 19
    { Week: dates[7], Discipline: "MEP", Percent: 73 }, // May 26

    // Fire Fighting
    { Week: dates[0], Discipline: "Fire Fighting", Percent: 0 }, // Apr 7
    { Week: dates[1], Discipline: "Fire Fighting", Percent: 2 }, // Apr 14
    { Week: dates[2], Discipline: "Fire Fighting", Percent: 7 }, // Apr 21
    { Week: dates[3], Discipline: "Fire Fighting", Percent: 13 }, // Apr 28
    { Week: dates[4], Discipline: "Fire Fighting", Percent: 19 }, // May 5
    { Week: dates[5], Discipline: "Fire Fighting", Percent: 31 }, // May 12
    { Week: dates[6], Discipline: "Fire Fighting", Percent: 45 }, // May 19
    { Week: dates[7], Discipline: "Fire Fighting", Percent: 60 }, // May 26

    // Landscape
    { Week: dates[0], Discipline: "Landscape", Percent: 0 }, // Apr 7
    { Week: dates[1], Discipline: "Landscape", Percent: 0 }, // Apr 14
    { Week: dates[2], Discipline: "Landscape", Percent: 3 }, // Apr 21
    { Week: dates[3], Discipline: "Landscape", Percent: 7 }, // Apr 28
    { Week: dates[4], Discipline: "Landscape", Percent: 16 }, // May 5
    { Week: dates[5], Discipline: "Landscape", Percent: 26 }, // May 12
    { Week: dates[6], Discipline: "Landscape", Percent: 34 }, // May 19
    { Week: dates[7], Discipline: "Landscape", Percent: 41 }, // May 26
  ];

  const disciplines = [...new Set(bimProgressData.map((d) => d.Discipline))];

  const colors = {
    series: ["#FDDD60", "#FF6E76", "#59D9F9", "#7CFFB2", "#FF8A45"], // Using specified palette
    text: isDark ? "#e0e0e0" : "#1a202c",
    secondaryText: isDark ? "#a0aec0" : "#4a5568",
    background: isDark ? "#1e1e1e" : "#ffffff",
    border: isDark ? "#555" : "#ddd",
    axisLine: isDark ? "#71717a" : "#d1d5db",
    gridLine: isDark ? "#444" : "#e5e7eb",
    cardBg: isDark ? "bg-zinc-950" : "bg-[#EBECF0]", // Using specified color for background
    cardShadow: isDark ? "shadow-xl" : "shadow-md",
  };

  const dataset = [
    { id: "dataset_raw", source: bimProgressData },
    ...disciplines.map((d) => ({
      id: `dataset_${d}`,
      fromDatasetId: "dataset_raw",
      transform: {
        type: "filter",
        config: { and: [{ dimension: "Discipline", "=": d }] },
      },
    })),
  ];

  const series = disciplines.map((discipline, index) => ({
    type: "line",
    datasetId: `dataset_${discipline}`,
    name: discipline,
    smooth: 0.2,
    showSymbol: true,
    symbolSize: 6,
    endLabel: {
      show: true,
      formatter: (params: any) =>
        `${params.data.Discipline}: ${params.data.Percent}%`,
      color: colors.text,
      fontWeight: "bold",
    },
    labelLayout: { moveOverlap: "shiftY", dy: -10 },
    emphasis: { focus: "series", lineStyle: { width: 4 } },
    encode: {
      x: "Week",
      y: "Percent",
      label: ["Discipline", "Percent"],
      itemName: "Week",
      tooltip: ["Percent"],
    },
    lineStyle: { width: 3, color: colors.series[index] },
    itemStyle: { color: colors.series[index] },
  }));

  const option = {
    animationDuration: 1000,
    color: colors.series,
    backgroundColor: "transparent",
    dataset,
    title: {
      text: "BIM Progress by Discipline (Apr 7 - May 26, 2025)",
      subtext: "Updated: Wed, May 28, 2025, 10:28 PM +07",
      left: "center",
      textStyle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "bold",
      },
      subtextStyle: {
        fontSize: 12,
        color: colors.secondaryText,
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      textStyle: { color: colors.text },
      formatter: (params: any[]) => {
        const week = params[0].axisValue;
        return `<strong>${week}</strong><br/>` +
          params
            .map(
              (p) =>
                `<span style="color:${p.color};font-weight:600">${p.seriesName}</span>: ${p.value.Percent}%`
            )
            .join("<br/>");
      },
    },
    legend: {
      top: 50,
      textStyle: { color: colors.text },
    },
    xAxis: {
      type: "category",
      name: "Date",
      axisLine: { lineStyle: { color: colors.axisLine } },
      axisLabel: {
        color: colors.secondaryText,
        rotate: 45, // Rotate labels for readability
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      name: "Progress (%)",
      max: 100,
      axisLine: { lineStyle: { color: colors.axisLine } },
      axisLabel: {
        color: colors.secondaryText,
        formatter: "{value}%",
      },
      splitLine: {
        lineStyle: { color: colors.gridLine, type: "dashed" },
      },
    },
    grid: {
      left: 60,
      right: 100,
      bottom: 50,
      top: 100,
      containLabel: true,
    },
    series,
  };

  return (
    <Card 
      className={`${colors.cardBg} ${colors.cardShadow} border border-gray-200 dark:border-zinc-800 rounded-xl`}
    >
      <CardContent className="p-6">
        <ReactECharts option={option} style={{ height: 400, width: "100%" }} />
      </CardContent>
    </Card>
  );
}

export default BIMMultiLineChart;