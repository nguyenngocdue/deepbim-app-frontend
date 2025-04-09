import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function RightSidebarTabs({
  themeClass,
  tabs,
}: {
  themeClass: string;
  tabs: { name: string; value: string; content: React.ReactNode }[];
}) {
  return (
    <Tabs defaultValue={tabs[0].value} className={`border-t border-slate-800 ${themeClass}`}>
      <TabsList className="w-full p-0 justify-start rounded-none bg-slate-900">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none bg-slate-900 h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <code className="text-sm font-heading  ">{tab.name}</code>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="p-2">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}