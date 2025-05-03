import { ReactNode } from "@tanstack/react-router";
import SidebarTabs from "./SidebarTabs";

export interface TabConfig {
  name: string;
  value: string;
  content: ReactNode;
}

interface RightSidebarViewerProps {
  themeClass: string;
  tabs: TabConfig[];
}

export default function RightSidebarViewer({
  themeClass,
  tabs,
}: RightSidebarViewerProps) {
  return <SidebarTabs themeClass={themeClass} tabs={tabs} />
}
