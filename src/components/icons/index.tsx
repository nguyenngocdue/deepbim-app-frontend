import { LuWorkflow } from "react-icons/lu";
import { TbBoxModel2 } from "react-icons/tb";
import { GrProjects } from "react-icons/gr";
import { TiFlowChildren } from "react-icons/ti";
import { MdWorkspaces, MdAdminPanelSettings } from "react-icons/md";
import { BsChatQuoteFill } from "react-icons/bs";
import { ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";

export const AppIcons = {
  Workflow: (props: any) => <LuWorkflow size={20} {...props} />,
  BoxModel: (props: any) => <TbBoxModel2 size={20} {...props} />,
  Projects: (props: any) => <GrProjects size={16} {...props} />,
  SubProjects: (props: any) => <TiFlowChildren size={20} {...props} />,
  Workspaces: (props: any) => <MdWorkspaces size={20} {...props} />,
  AdminPanel: (props: any) => <MdAdminPanelSettings size={20} {...props} />,
  Chat: (props: any) => <BsChatQuoteFill size={20} {...props} />,
  ChevronLeft: (props: any) => <ChevronLeft size={20} {...props} />,
  ChevronRight: (props: any) => <ChevronRight size={20} {...props} />,
  Home: (props: any) => <Home size={20} {...props} />,
  Menu: (props: any) => <Menu size={20} {...props} />, // Thêm icon Menu
  X: (props: any) => <X size={20} {...props} />, // Thêm icon X
};