import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDarkMode } from "@/hooks/useDarkMode";

// Generate real dates for the past 10 weeks, starting from May 28, 2025
const generateDates = () => {
  const endDate = new Date("2025-05-28"); // Current date: May 28, 2025
  const dates = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (9 - i) * 7 - (endDate.getDay() === 0 ? 6 : endDate.getDay() - 1)); // Adjust to previous Monday
    dates.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), // Format: "Mar 24"
      completed: progressTrendData[i].completed,
    });
  }
  return dates;
};

const progressTrendData = [
  { week: "Week 1", completed: 12 },
  { week: "Week 2", completed: 24 },
  { week: "Week 3", completed: 38 },
  { week: "Week 4", completed: 51 },
  { week: "Week 5", completed: 63 },
  { week: "Week 6", completed: 72 },
  { week: "Week 7", completed: 84 },
  { week: "Week 8", completed: 91 },
  { week: "Week 9", completed: 97 },
  { week: "Week 10", completed: 100 },
];

const updatedProgressTrendData = generateDates();

export function EChartsLineProgress() {
  const isDark = useDarkMode();

  const theme = {
    text: isDark ? "#e4e4e7" : "#1f2937",
    subtext: isDark ? "#a1a1aa" : "#6b7280",
    axis: isDark ? "#71717a" : "#9ca3af",
    label: isDark ? "#d4d4d8" : "#4b5563",
    tooltipBg: isDark ? "#27272a" : "#fff",
    tooltipText: isDark ? "#f4f4f5" : "#333",
    tooltipBorder: isDark ? "#52525b" : "#ddd",
    gridLine: isDark ? "#3f3f46" : "#e5e7eb",
    lineColor: "#FF6E76", // Using specified color for the line
    areaColor: isDark ? "rgba(255, 110, 118, 0.1)" : "rgba(255, 110, 118, 0.08)", // Matching line color
    pointColor: "#FDDD60", // Using specified color for points
  };

  const option = {
    backgroundColor: "transparent",
    textStyle: { color: theme.text },
    title: {
      text: "Project Completion Trend",
      subtext: "Weekly cumulative progress (%) - Updated May 28, 2025, 10:24 PM",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.text,
      },
      subtextStyle: {
        fontSize: 12,
        color: theme.subtext,
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: theme.tooltipText },
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>Completed: ${data.value}%`;
      },
    },
    grid: { left: 40, right: 20, bottom: 40, top: 80 },
    xAxis: {
      type: "category",
      data: updatedProgressTrendData.map((item) => item.date),
      axisLine: { lineStyle: { color: theme.axis } },
      axisLabel: {
        color: theme.label,
        rotate: 45, // Rotate labels for better readability
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLine: { lineStyle: { color: theme.axis } },
      splitLine: { lineStyle: { color: theme.gridLine, type: "dashed" } },
      axisLabel: { color: theme.label, formatter: "{value}%" },
    },
    series: [
      {
        name: "Completed",
        data: updatedProgressTrendData.map((item) => item.completed),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 3, color: theme.lineColor },
        itemStyle: { color: theme.pointColor },
        areaStyle: { color: theme.areaColor },
      },
    ],
  };

  return (
    <Card
      className={`${
        isDark
          ? "bg-gradient-to-br from-zinc-950 to-zinc-900 border-slate-700"
          : "bg-gradient-to-br from-slate-50 to-white border-slate-200"
      } shadow-md rounded-xl overflow-hidden w-full`}
    >
      <CardContent className="p-4">
        <ReactECharts option={option} style={{ height: 300, width: "100%" }} />
      </CardContent>
    </Card>
  );
}

export default EChartsLineProgress;