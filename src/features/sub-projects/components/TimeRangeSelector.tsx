import React, { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";

interface QuickRange {
  label: string;
  value: string;
}

interface TimeRangeSelectorProps {
  onRangeChange?: (range: string) => void;
  onRefreshChange?: (interval: string) => void;
}

export function TimeRangeSelector({ onRangeChange, onRefreshChange }: TimeRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Last 1 hour");
  const [refreshInterval, setRefreshInterval] = useState("Off");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [isCustomRange, setIsCustomRange] = useState(false);

  const quickRanges: QuickRange[] = [
    { label: "Last 5 minutes", value: "now-5m" },
    { label: "Last 15 minutes", value: "now-15m" },
    { label: "Last 1 hour", value: "now-1h" },
    { label: "Last 6 hours", value: "now-6h" },
    { label: "Last 24 hours", value: "now-24h" },
    { label: "Last 7 days", value: "now-7d" },
  ];

  const refreshIntervals: string[] = ["Off", "30s", "1m", "5m", "15m"];

  const handleRangeSelect = (range: QuickRange) => {
    setSelectedRange(range.label);
    setIsCustomRange(false);
    setIsOpen(false);
    if (onRangeChange) onRangeChange(range.value);
    console.log(`Selected time range: ${range.value}`);
  };

  const handleCustomRangeApply = () => {
    if (customFrom && customTo) {
      const range = `${customFrom} to ${customTo}`;
      setSelectedRange(range);
      setIsCustomRange(false);
      setIsOpen(false);
      if (onRangeChange) onRangeChange(range);
      console.log(`Custom time range: from ${customFrom} to ${customTo}`);
    }
  };

  const handleRefreshChange = (interval: string) => {
    setRefreshInterval(interval);
    if (onRefreshChange) onRefreshChange(interval);
    console.log(`Refresh interval set to: ${interval}`);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isOpen ? "border-[#FF6E76]" : "border-gray-300 dark:border-zinc-600"} ${isOpen ? "bg-gray-100 dark:bg-zinc-800" : "bg-[#EBECF0] dark:bg-zinc-900"} text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200`}
      >
        <Clock className="h-5 w-5 text-[#59D9F9]" />
        <span>{selectedRange}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 z-10 animate-fadeIn">
          <div className="p-4">
            {/* Tabs for Quick Ranges and Custom Range */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsCustomRange(false)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${!isCustomRange ? "bg-[#FF6E76] text-white" : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"}`}
              >
                Quick Ranges
              </button>
              <button
                onClick={() => setIsCustomRange(true)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${isCustomRange ? "bg-[#FF6E76] text-white" : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"}`}
              >
                Custom Range
              </button>
            </div>

            {/* Quick Ranges */}
            {!isCustomRange && (
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {quickRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleRangeSelect(range)}
                    className="px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 transition-colors duration-200"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}

            {/* Custom Range */}
            {isCustomRange && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    From
                  </label>
                  <input
                    type="datetime-local"
                    value={customFrom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomFrom(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6E76]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    To
                  </label>
                  <input
                    type="datetime-local"
                    value={customTo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6E76]"
                  />
                </div>
                <button
                  onClick={handleCustomRangeApply}
                  className="w-full px-4 py-2 bg-[#FF6E76] text-white rounded-md hover:bg-[#FF8A45] transition-colors duration-200"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Refresh Interval */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Refresh Every
              </label>
              <select
                value={refreshInterval}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleRefreshChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6E76]"
              >
                {refreshIntervals.map((interval) => (
                  <option key={interval} value={interval}>
                    {interval}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeRangeSelector;