import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useEffect, useRef } from "react";
import { Users } from "lucide-react";

// Generate real dates for the past 8 weeks, starting from May 28, 2025
const generateDates = () => {
  const endDate = new Date("2025-05-28");
  const dates: string[] = [];
  for (let i = 0; i < 8; i++) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (7 - i) * 7 - (endDate.getDay() === 0 ? 6 : endDate.getDay() - 1)); // Adjust to previous Monday
    dates.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" })); // Format: "Apr 7"
  }
  return dates;
};

export function BIMProgressChart() {
  const isDark = useDarkMode();
  const chartRef = useRef<any>(null);
  const dates = generateDates();

  // Data for BIM project milestones and workers over 8 weeks
  const milestoneData = [
    ["Milestone", ...dates],
    ["Design Completion", 10, 20, 35, 50, 65, 78, 85, 92],
    ["Model Coordination", 5, 15, 25, 40, 55, 70, 80, 88],
    ["Clash Detection", 2, 10, 18, 30, 45, 60, 75, 85],
    ["Construction Documentation", 0, 5, 15, 25, 40, 55, 70, 80],
    ["Workers", 20, 22, 25, 28, 30, 32, 35, 38], // New worker data
  ];

  const colors = {
    series: ["#FDDD60", "#FF6E76", "#59D9F9", "#7CFFB2", "#6b7280"], // Added gray-500 for workers
    text: isDark ? "#e0e0e0" : "#1a202c",
    secondaryText: isDark ? "#a0aec0" : "#4a5568",
    background: isDark ? "#1e1e1e" : "#EBECF0",
    border: isDark ? "#555" : "#ddd",
    axisLine: isDark ? "#71717a" : "#d1d5db",
    gridLine: isDark ? "#444" : "#e5e7eb",
    cardBg: isDark ? "bg-zinc-950" : "bg-[#EBECF0]",
    cardShadow: isDark ? "shadow-xl" : "shadow-md",
  };

  const option = {
    animationDuration: 1000,
    color: colors.series,
    backgroundColor: "transparent",
    title: {
      // text: "BIM Project Milestones & Workforce",
      // subtext: "Hover on the line chart to update the pie chart",
      top: 5,
      left: "left",
      textStyle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "600",
      },
      subtextStyle: {
        fontSize: 12,
        color: colors.secondaryText,
        padding: [5, 0, 0, 0],
      },
    },
    legend: {
      top: "95%",
      left: "center",
      orient: "horizontal",
      textStyle: { color: colors.text, fontSize: 11 },
      itemGap: 15,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      textStyle: { color: colors.text },
      formatter: (params: any[]) => {
        const date = params[0].axisValue;
        return `<strong>${date}</strong><br/>` +
          params
            .map((p, i) =>
              i < 4 // Only format milestones as percentages
                ? `<span style="color:${p.color};font-weight:600">${p.seriesName}</span>: ${p.value[p.seriesIndex + 1]}%`
                : `<span style="color:${p.color};font-weight:600">${p.seriesName}</span>: ${p.value[p.seriesIndex + 1]}`
            )
            .join("<br/>");
      },
    },
    dataset: {
      source: milestoneData,
    },
    xAxis: {
      type: "category",
      name: "Date",
      axisLine: { lineStyle: { color: colors.axisLine } },
      axisLabel: {
        color: colors.secondaryText,
        rotate: 45,
        fontSize: 10,
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Completion (%)",
        max: 100,
        axisLine: { lineStyle: { color: colors.axisLine } },
        axisLabel: {
          color: colors.secondaryText,
          formatter: "{value}%",
          fontSize: 10,
        },
        splitLine: {
          lineStyle: { color: colors.gridLine, type: "dashed" },
        },
      },
      {
        type: "value",
        name: "Workers",
        position: "right",
        max: 50, // Adjust based on worker data range
        axisLine: { lineStyle: { color: colors.axisLine } },
        axisLabel: {
          color: colors.secondaryText,
          fontSize: 10,
        },
        splitLine: { show: false }, // Avoid clutter with left y-axis split lines
      },
    ],
    grid: {
      left: 60,
      right: 60,
      bottom: 50,
      top: "40%",
      containLabel: true,
    },
    series: [
      { type: "line", smooth: true, seriesLayoutBy: "row", emphasis: { focus: "series" } },
      { type: "line", smooth: true, seriesLayoutBy: "row", emphasis: { focus: "series" } },
      { type: "line", smooth: true, seriesLayoutBy: "row", emphasis: { focus: "series" } },
      { type: "line", smooth: true, seriesLayoutBy: "row", emphasis: { focus: "series" } },
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        yAxisIndex: 1, // Use right y-axis for workers
        emphasis: { focus: "series" },
        lineStyle: { width: 3, type: "dashed" }, // Dashed line for distinction
        symbol: "square", // Different symbol for workers
        symbolSize: 6,
      },
      {
        type: "pie",
        id: "pie",
        radius: "25%",
        center: ["50%", "18%"],
        emphasis: { focus: "self" },
        label: {
          formatter: "{b}: {@[1]} ({d}%)",
          color: colors.text,
          fontSize: 10,
        },
        encode: {
          itemName: "Milestone",
          value: dates[0],
          tooltip: dates[0],
        },
        // Exclude Workers from pie chart
        data: milestoneData.slice(1, 5).map((row) => ({
          name: row[0],
          value: row[1],
        })),
      },
    ],
  };

  useEffect(() => {
    const chartInstance = chartRef.current?.getEchartsInstance();
    if (chartInstance) {
      chartInstance.on("updateAxisPointer", (event: any) => {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          chartInstance.setOption({
            series: {
              id: "pie",
              label: {
                formatter: `{b}: {@[${dimension}]} ({d}%)`,
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
              // Update pie chart data, excluding Workers
              data: milestoneData.slice(1, 5).map((row) => ({
                name: row[0],
                value: row[dimension],
              })),
            },
          });
        }
      });
    }
  }, []);

  return (
    <Card
      className={`${colors.cardBg} ${colors.cardShadow} border border-gray-200 dark:border-zinc-800 rounded-lg`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-indigo-600" />
          <div>
            <h3 className="text-base font-semibold text-50">BIM Milestones & Workforce</h3>
            <p className="text-xs text-subtitle2">Completion and Worker Trends</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ height: 450, width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </CardContent>
    </Card>
  );
}

export default BIMProgressChart;