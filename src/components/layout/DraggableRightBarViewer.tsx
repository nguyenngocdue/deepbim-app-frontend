import { Panel } from "react-resizable-panels";
import DraggableTemplate from "../bim-viewer/common/DraggableTemplate";
import RightSidebarViewer from "./RightSidebarViewer";
import { useViewportSize } from "@/features/bim-viewer/hooks/useViewportSize";

export default function DraggableRightBarViewer(props: { 
  hasDirection: boolean; 
  sidebarTabs: any; 
  initialPosition?: { x: number; y: number }; 
  visible: boolean,
  onClose: () => void,
}) {
  const screenSize = useViewportSize();
  const { 
    hasDirection, 
    sidebarTabs, 
    initialPosition = { x: screenSize.width - 400, y: 50 },
    visible = true,
    onClose,
  } = props;
  
  return (
    <DraggableTemplate hasDirection={hasDirection} initialPosition={initialPosition} visible={visible} onClose={onClose}>
      {() => (
          <RightSidebarViewer themeClass="dark-theme" tabs={sidebarTabs} />
      )}
    </DraggableTemplate>
  );
}
