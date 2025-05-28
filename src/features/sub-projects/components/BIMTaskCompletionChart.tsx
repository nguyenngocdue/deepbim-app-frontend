import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDarkMode } from "@/hooks/useDarkMode";

const BIMTaskCompletionChart = ({
  data = [
    [80, 90, 85, 70, 95, 100, 90], // Structural
    [60, 65, 70, 80, 75, 85, 90],  // Architectural
    [50, 55, 60, 65, 70, 80, 85],  // MEP
    [70, 60, 65, 75, 80, 85, 90],  // Civil
    [90, 85, 80, 95, 100, 90, 95], // Coordination
  ],
  title = "BIM Task Completion by Week",
}) => {
  const isDark = useDarkMode();

  const theme = {
    background: isDark ? "#1f2937" : "#f9fafb",
    text: isDark ? "#f3f4f6" : "#1f2937",
    border: isDark ? "#374151" : "#e5e7eb",
    tooltipBg: isDark ? "#111827" : "#ffffff",
    tooltipBorder: isDark ? "#4b5563" : "#d1d5db",
    colors: ["#fbbf24", "#f87171", "#60a5fa", "#34d399", "#c084fc"],
  };

  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const totalData = data[0].map((_, i) => data.reduce((sum, series) => sum + series[i], 0));

  const series = ["Structural", "Architectural", "MEP", "Civil", "Coordination"].map((name, i) => ({
    name,
    type: "bar",
    stack: "total",
    barWidth: "60%",
    label: {
      show: true,
      fontSize: 10,
      color: theme.text,
      formatter: (p: any) => Math.round(p.value * 1000) / 10 + "%",
    },
    itemStyle: { color: theme.colors[i] },
    data: data[i].map((val, j) => (totalData[j] === 0 ? 0 : val / totalData[j])),
  }));

  const option = {
    backgroundColor: "transparent",
    color: theme.colors,
    title: {
      text: title,
      left: "center",
      top: 10,
      textStyle: {
        color: theme.text,
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    legend: {
      top: "bottom",
      textStyle: { color: theme.text, fontSize: 12 },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: theme.text },
      formatter: (params: any[]) => {
        const day = params[0].axisValue;
        return params.reduce(
          (html, p) =>
            html +
            `<span style="color:${p.color};font-weight:600">${p.seriesName}</span>: ${(p.value * 100).toFixed(
              1
            )}% (${data[p.seriesIndex][p.dataIndex]} tasks)<br/>`,
          `<strong>${day}</strong><br/>`
        );
      },
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: theme.border } },
      axisLabel: { color: theme.text, fontSize: 12 },
    },
    yAxis: {
      type: "value",
      max: 1,
      axisLabel: {
        formatter: "{value}%",
        color: theme.text,
        fontSize: 12,
      },
      axisLine: { lineStyle: { color: theme.border } },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: isDark ? "#334155" : "#e5e7eb",
        },
      },
    },
    grid: {
      left: 60,
      right: 60,
      top: 80,
      bottom: 60,
      containLabel: true,
    },
    series,
  };

  return (
    <div className="flex justify-center h-[450px]">
      <Card 
       className={`${
          isDark
            ? "bg-gradient-to-br from-zinc-950 to-zinc-900 border-slate-700"
            : "bg-gradient-to-br from-slate-50 to-white border-slate-200"
        } shadow-md rounded-xl overflow-hidden max-w-4xl w-full`}
      >
        <CardContent className="p-5">
          <ReactECharts
            option={option}
            style={{ height: 400, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BIMTaskCompletionChart;
