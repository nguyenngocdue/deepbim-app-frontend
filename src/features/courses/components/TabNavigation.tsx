import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { BookOpen, Book, Clock } from "lucide-react";

const tabs = [
  { label: "Tổng quan", icon: BookOpen },
  { label: "Chương trình đào tạo", icon: Book },
  { label: "Mentor", icon: Clock },
];

interface TabNavigationProps {
  onTabChange: (tabIndex: number) => void;
}

export default function TabNavigation({ onTabChange }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const handleTabChange = (value: string) => {
    const index = tabs.findIndex((tab) => tab.label === value);
    setActiveTab(value);
    onTabChange(index);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="" // Reduced from my-6 to my-2
    >
      <TabsList className="bg-gray-900 border-b border-gray-700/30 h-auto p-2 rounded-lg flex flex-row justify-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.label}
              value={tab.label}
              className="px-4 py-2 text-sm font-semibold text-gray-300 rounded-md transition-all duration-300 flex items-center gap-4 data-[state=active]:bg-green-800/50 data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-500 hover:bg-gray-800/50 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}