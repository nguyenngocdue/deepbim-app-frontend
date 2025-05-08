import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SidebarTabs({
  themeClass,
  tabs,
}: {
  themeClass: string;
  tabs: { name: string; value: string; content: React.ReactNode }[];
}) {
  
  return (
    <Tabs defaultValue={tabs[0].value} className={`w-full ${themeClass}`}>
      <div className="w-full bg-slate-800 border-b border-slate-700 px-2 pt-1">
        <TabsList className="flex flex-wrap gap-1 justify-start bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-5 py-2 text-sm font-medium text-slate-300 data-[state=active]:bg-blue-600  data-[state=active]:text-white rounded-lg transition-all hover:text-white"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="px-2 pb-2  pt-1 text-sm text-slate-100">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
