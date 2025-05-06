import { Panel } from "react-resizable-panels";
import DraggableTemplate from "../bim-viewer/common/DraggableTemplate";
import RightSidebarViewer from "./RightSidebarViewer";
import { useViewportSize } from "@/features/bim-viewer/hooks/useViewportSize";

export default function DraggableRightBarViewer(props: { 
  hasDirection: boolean; 
  sidebarTabs: any; 
  initialPosition?: { x: number; y: number }; 
}) {
  const screenSize = useViewportSize();
  const { 
    hasDirection, 
    sidebarTabs, 
    initialPosition = { x: screenSize.width - 400, y: 50 } 
  } = props;
  
  return (
    <DraggableTemplate hasDirection={hasDirection} initialPosition={initialPosition}>
      {() => (
        <Panel defaultSize={20} minSize={5} maxSize={50} className="">
          <RightSidebarViewer themeClass="dark-theme" tabs={sidebarTabs} />
        </Panel>
      )}
    </DraggableTemplate>
  );
}
