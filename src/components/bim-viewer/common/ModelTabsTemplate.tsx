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
  contentHeight = "", // chiều cao tối thiểu
}: ModelTabsTemplateProps) {
  return (
    <div className="flex flex-col w-full h-full">
      <Tabs defaultValue={defaultValue} className="w-full flex-grow ">
        <div className="w-full  border-b border-zinc-800 pb-2">
          <TabsList className="flex gap-3 bg-transparent justify-start p-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-5 py-2 text-sm font-medium text-slate-300 data-[state=active]:bg-blue-600  data-[state=active]:text-white rounded-lg transition-all hover:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className={`mt-4 flex-1 ${contentHeight}`}>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="rounded-md text-white h-full">
                {tab.content}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
