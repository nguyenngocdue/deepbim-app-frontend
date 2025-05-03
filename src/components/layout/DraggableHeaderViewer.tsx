import DraggableTemplate from "../bim-viewer/common/DraggableTemplate";
import HeaderViewer from "./HeaderViewer";

export default function DraggableHeaderViewer({
  onToggle,
  onToggleTheme,
  currentTheme,
  handleFileSelect,
  navigationMode,
  onModelReady,
  states,
}: any) {
  return (
    <DraggableTemplate initialPosition={{x:30, y:30}}>
      {(isVertical) => (
        <HeaderViewer
          onToggle={onToggle}
          onToggleTheme={onToggleTheme}
          currentTheme={currentTheme}
          handleFileSelect={handleFileSelect}
          navigationMode={navigationMode}
          onModelReady={onModelReady}
          isVertical={isVertical}
          {...states}
        />
      )}
    </DraggableTemplate>
  );
}
