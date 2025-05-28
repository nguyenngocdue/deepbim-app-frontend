import ReactECharts from "echarts-for-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDarkMode } from "@/hooks/useDarkMode";

interface TeamMemberData {
  name: string;
  value: number;
}

export function TeamMemberRoseChart({
  data = [
    { name: "Structural", value: 12 },
    { name: "Architectural", value: 8 },
    { name: "MEP", value: 20 },
    { name: "Civil", value: 7 },
    { name: "Fire Protection", value: 9 },
    { name: "Landscape", value: 18 },
    { name: "Coordination", value: 22 },
    { name: "Sustainability", value: 10 },
  ],
  title = "Number of Members per BIM Team",
  alertThreshold = 15,
}: {
  data?: TeamMemberData[];
  title?: string;
  alertThreshold?: number;
}) {
  const isDark = useDarkMode();
  const theme = isDark ? "dark" : "light";

  const themeColors = {
    light: {
      background: "#f0f4f8",
      text: "#1a202c",
      secondaryText: "#4a5568",
      border: "#cbd5e0",
      shadow: "rgba(255, 255, 255, 0.2)",
      normalColors: [
        "#ff69b4",
        "#87ceeb",
        "#ffa500",
        "#90ee90",
        "#b57edc",
        "#ffff99",
        "#40e0d0",
        "#ff7f50",
      ],
      alertColor: {
        type: "radial",
        x: 0.5,
        y: 0.5,
        r: 0.7,
        colorStops: [
          { offset: 0, color: "#fff0f0" },
          { offset: 1, color: "#ff7f50" },
        ],
      },
      alertShadow: "#ff9999",
    },
    dark: {
      background: "#1a202c",
      text: "#e2e8f0",
      secondaryText: "#a0aec0",
      border: "#2d3748",
      shadow: "rgba(0, 0, 0, 0.15)",
      normalColors: [
        "#4dabf5",
        "#ffca28",
        "#66bb6a",
        "#ef5350",
        "#ab47bc",
        "#ffd54f",
        "#26c6da",
        "#ff8a65",
      ],
      alertColor: {
        type: "radial",
        x: 0.5,
        y: 0.5,
        r: 0.7,
        colorStops: [
          { offset: 0, color: "#f50ace" },
          { offset: 1, color: "#ff7f50" },
        ],
      },
      alertShadow: "#ff9999",
    },
  };

  const colors = themeColors[theme];

  const roseData = data.map((item, i) => ({
    value: item.value,
    name: item.name,
    itemStyle:
      item.value > alertThreshold
        ? {
            color: colors.alertColor,
            shadowBlur: 20,
            shadowColor: colors.alertShadow,
          }
        : {
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.7,
              colorStops: [
                { offset: 0, color: theme === "dark" ? "#2d3748" : "#f7fafc" },
                {
                  offset: 1,
                  color: colors.normalColors[i % colors.normalColors.length],
                },
              ],
            },
            shadowBlur: 15,
            shadowColor:
              colors.normalColors[i % colors.normalColors.length],
          },
    label: {
      fontWeight: "600",
      fontSize: 13,
      color:
        item.value > alertThreshold
          ? colors.alertColor.colorStops[1].color
          : colors.text,
      formatter: item.value > alertThreshold
        ? `{a|${item.name}: ${item.value}}\n{b|⚠️ Too many!}`
        : `${item.name}: ${item.value}`,
      rich: {
        a: {
          fontWeight: "600",
          fontSize: 13,
          color: colors.alertColor.colorStops[1].color,
        },
        b: {
          fontWeight: "500",
          fontSize: 11,
          color: colors.alertColor.colorStops[1].color,
        },
      },
    },
  }));

  const option = {
    backgroundColor: "transparent",
    title: {
      text: title,
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      textStyle: {
        color: colors.text,
        fontWeight: 600,
      },
      formatter: (params: any) =>
        params.value > alertThreshold
          ? `<b>${params.name}:</b> ${params.value}<br/><span style="color:${colors.alertColor.colorStops[1].color};font-weight:600;">⚠️ Overloaded team!</span>`
          : `<b>${params.name}:</b> ${params.value}`,
    },
    legend: {
      top: "bottom",
      textStyle: {
        color: colors.text,
        fontSize: 12,
        fontWeight: 600,
      },
    },
    series: [
      {
        name: "Team Members",
        type: "pie",
        radius: ["25%", "65%"],
        roseType: "area",
        center: ["50%", "50%"],
        data: roseData,
        animationDuration: 1000,
        itemStyle: {
          borderRadius: 6,
          borderColor: colors.background,
          borderWidth: 1.5,
        },
        labelLine: {
          length: 8,
          length2: 8,
          smooth: 0.3,
        },
        emphasis: {
          scale: true,
          scaleSize: 12,
          itemStyle: {
            borderWidth: 2,
            borderColor: theme === "dark" ? "#f4d03f" : "#eab308",
            shadowBlur: 20,
            shadowColor: "#ca8a04",
          },
        },
      },
    ],
  };

  return (
    <div className="flex justify-center h-[450px]">
      <Card
        className={`${
          theme === "dark"
            ? "bg-gradient-to-br from-zinc-950 to-zinc-900 border-slate-700"
            : "bg-gradient-to-br from-slate-50 to-white border-slate-200"
        } shadow-md rounded-xl overflow-hidden max-w-4xl w-full`}
      >
        <CardContent className="p-4 sm:p-6">
          <ReactECharts
            option={option}
            style={{ height: 420, width: "100%", minWidth: "280px" }}
            opts={{ renderer: "svg" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
