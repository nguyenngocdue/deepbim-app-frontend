import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
const tabs = [
  {
    name: "pnpm",
    value: "pnpm",
    content: "pnpm dlx shadcn@latest add tabs",
  },
  {
    name: "npm",
    value: "npm",
    content: "npx shadcn@latest add tabs",
  },
  {
    name: "yarn",
    value: "yarn",
    content: "npx shadcn@latest add tabs",
  },
  {
    name: "bun",
    value: "bun",
    content: "bunx --bun shadcn@latest add tabs",
  },
];

export default function ViewerFooterTabs( { themeClass }: { themeClass: string }) {
  return (
    <Tabs defaultValue={tabs[0].value} className={`w-full border-t border-slate-800 px-4`} >
      <TabsList className={`w-full p-0 justify-start  rounded-none bg-slate-900`}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className=" rounded-none bg-slate-900 h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <code className="text-[13px]">{tab.name}</code>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="h-10 flex items-center justify-between rounded-md pl-3 pr-1.5">
            <code className="text-[13px]">{tab.content}</code>
            <Button size="icon" variant="secondary" className="h-7 w-7 bg-slate-900">
              <Copy className="!h-3.5 !w-3.5" />
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}