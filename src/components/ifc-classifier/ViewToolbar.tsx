import { Button } from "@/components/ui/button";
import { useIFCContext, SelectedElementInfo } from "@/context/ifc/ifc-context";
import { useTranslation } from "react-i18next";
import { EyeOff, Layers as LayersIcon, Maximize, Focus, Undo2 } from "lucide-react";

interface ViewToolbarProps {
  onZoomExtents: () => void;
  onZoomSelected: () => void;
  isElementSelected: boolean;
  onUnhideAll: () => void;
  onUnhideLast: () => void;
  onSelectAllVisible: () => void;
}

export default function ViewToolbar({
  onZoomExtents,
  onZoomSelected,
  isElementSelected,
  onUnhideAll,
  onUnhideLast,
  onSelectAllVisible,
}: ViewToolbarProps) {
  const {
    selectedElements,
    toggleUserHideElement,
    userHiddenElements,
    loadedModels,
    clearSelection,
  } = useIFCContext();

  const { t } = useTranslation();

  const handleHideSelected = () => {
    if (selectedElements.length) {
      const elementsToHide = [...selectedElements];
      clearSelection();
      elementsToHide.forEach((el) => toggleUserHideElement(el));
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
      <div className="flex items-center gap-1 p-2 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl border-color-standard">
        <div className="flex items-center gap-1 px-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomExtents}
            title={t('modelViewer.fitToView')}
            className="hover:bg-accent/80 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomSelected}
            disabled={!isElementSelected}
            title={t('modelViewer.zoomToSelected')}
            className="hover:bg-accent/80 transition-colors disabled:opacity-40"
          >
            <Focus className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-border/50 mx-1" />
        <div className="flex items-center gap-1 px-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSelectAllVisible}
            disabled={loadedModels.length === 0}
            title={t('modelViewer.selectAllVisible')}
            className="hover:bg-accent/80 transition-colors disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </Button>
        </div>
        <div className="w-px h-6 bg-border/50 mx-1" />
        <div className="flex items-center gap-1 px-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHideSelected}
            disabled={selectedElements.length === 0}
            title={
              selectedElements.length > 0
                ? t('modelViewer.toggleVisibility')
                : t('modelViewer.selectElementToToggle')
            }
            className="hover:bg-accent/80 transition-colors disabled:opacity-40"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onUnhideLast}
            disabled={userHiddenElements.length === 0}
            title={t('modelViewer.unhideLast')}
            className="hover:bg-accent/80 transition-colors disabled:opacity-40"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onUnhideAll}
            disabled={userHiddenElements.length === 0}
            title={t('modelViewer.unhideAll')}
            className="hover:bg-accent/80 transition-colors disabled:opacity-40"
          >
            <LayersIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}