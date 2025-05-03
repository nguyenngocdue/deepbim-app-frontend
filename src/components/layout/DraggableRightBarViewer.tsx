import { Panel } from "react-resizable-panels";
import DraggableTemplate from "../bim-viewer/common/DraggableTemplate";
import RightSidebarViewer from "./RightSidebarViewer";
import { useViewportSize } from "@/features/bim-viewer/hooks/useViewportSize";
import ElementProperties from "../bim-viewer/element-properties/ElementProperties";
import CombineModelManager from "@/features/bim-viewer/modals/combine-model";

export default function DraggableRightBarViewer({
  onToggle,
  onToggleTheme,
  currentTheme,
  handleFileSelect,
  navigationMode,
  onModelReady,
  states,
  hasDirection
}: any) {
  const screenSize = useViewportSize();
  
  const sidebarTabs = [
    {
      name: "Combine Model",
      value: "Combine Model",
      content: <CombineModelManager />,
    }
  ];
  

  return (
    <DraggableTemplate hasDirection={hasDirection} initialPosition={{ x: screenSize.width-400 , y: 50 }}>
      {() => (
        <Panel defaultSize={20} minSize={5} maxSize={50} className="">
          <RightSidebarViewer themeClass="dark-theme" tabs={sidebarTabs} />
        </Panel>
      )}
    </DraggableTemplate>
  );
}
