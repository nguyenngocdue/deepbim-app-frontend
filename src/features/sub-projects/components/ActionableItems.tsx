import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

interface ActionableItem {
  id: number;
  description: string;
  priority: "High" | "Medium" | "Low";
}

export function ActionableItems() {
  const isDark = useDarkMode();

  const items: ActionableItem[] = [
    { id: 1, description: "3 RFIs pending response", priority: "High" },
    { id: 2, description: "Issue #109 assigned to you", priority: "Medium" },
    { id: 3, description: "File 'MEP_Plan_v4.ifc' missing description", priority: "Low" },
  ];

  const getPriorityStyles = (priority: string) => {
    const base = "text-white px-2 py-1 rounded-full text-xs font-semibold";
    switch (priority) {
      case "High":
        return `${base} ${isDark ? "bg-red-600" : "bg-red-500"}`;
      case "Medium":
        return `${base} ${isDark ? "bg-yellow-600" : "bg-yellow-500"}`;
      case "Low":
        return `${base} ${isDark ? "bg-blue-600" : "bg-blue-500"}`;
      default:
        return `${base} ${isDark ? "bg-gray-600" : "bg-gray-500"}`;
    }
  };

  return (
    <Card
      className={`rounded-xl border ${
        isDark ? "bg-zinc-900 border-zinc-800 shadow-md" : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <AlertCircle
            className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
          />
          <h3
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Actionable Items
          </h3>
        </div>

        {/* Divider */}
        <div
          className={`h-px mb-5 ${
            isDark
              ? "bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
              : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
          }`}
        />

        {/* Items */}
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-4 p-1 rounded-lg transition-all ${
                isDark
                  ? "hover:bg-zinc-800 text-gray-100"
                  : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              <span className={getPriorityStyles(item.priority)}>{item.priority}</span>
              <p className="text-sm font-medium">{item.description}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
