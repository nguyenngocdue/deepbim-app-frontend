import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ReactNode } from "react";

interface TabItem {
  label: string;
  value: string;
  content: ReactNode;
}

interface ModelTabsTemplateProps {
  tabs: TabItem[];
  defaultValue?: string;
  contentHeight?: string; // thêm tuỳ chọn chiều cao cố định
}

export default function ModelTabsTemplate({
  tabs,
  defaultValue = tabs[0]?.value,
  contentHeight = "min-h-[400px]", // chiều cao tối thiểu
}: ModelTabsTemplateProps) {
  return (
    <div className="flex flex-col w-full h-full">
      <Tabs defaultValue={defaultValue} className="flex flex-col w-full">
        {/* Sticky hoặc cố định phần tab header */}
        <div className="sticky top-0 z-10 bg-zinc-900">
          <TabsList className="w-full bg-zinc-800 p-1 rounded-lg flex">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Nội dung */}
        <div className={`mt-4 flex-1 ${contentHeight}`}>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="p-4 rounded-md bg-zinc-800 text-white h-full">
                {tab.content}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
