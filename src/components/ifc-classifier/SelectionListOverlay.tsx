import { useEffect, useState } from "react";
import { useIFCContext, SelectedElementInfo } from "@/context/ifc/ifc-context";
import { Checkbox } from "@/components/ui/checkbox";

export default function SelectionListOverlay() {
  const { selectedElements, getElementPropertiesCached, toggleElementSelection } = useIFCContext();
  const [names, setNames] = useState<Record<string, string>>({});
  const [displayElements, setDisplayElements] = useState<SelectedElementInfo[]>([]);

  useEffect(() => {
    if (selectedElements.length === 0) {
      setDisplayElements([]);
      setNames({});
    } else if (selectedElements.length > 1) {
      setDisplayElements(prev => {
        const newElements = [...prev];
        selectedElements.forEach(el => {
          const exists = newElements.some(
            existing => existing.modelID === el.modelID && existing.expressID === el.expressID
          );
          if (!exists) {
            newElements.push(el);
          }
        });
        return newElements;
      });
    }
  }, [selectedElements]);

  useEffect(() => {
    if (displayElements.length === 0) return;
    let mounted = true;
    Promise.all(
      displayElements.map((el) =>
        getElementPropertiesCached(el.modelID, el.expressID).then((p) => ({
          key: `${el.modelID}-${el.expressID}`,
          name: p?.attributes?.Name?.value || p?.attributes?.Name || `${el.expressID}`,
        }))
      )
    ).then((res) => {
      if (!mounted) return;
      const map: Record<string, string> = {};
      res.forEach((r) => {
        map[r.key] = r.name;
      });
      setNames(map);
    });
    return () => {
      mounted = false;
    };
  }, [displayElements, getElementPropertiesCached]);

  if (selectedElements.length <= 1) return null;

  const handleToggleElement = (element: SelectedElementInfo) => {
    toggleElementSelection(element, true);
  };

  return (
    <div className="absolute top-2 right-2 z-20 max-h-60 overflow-y-auto p-3 bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg pointer-events-auto">
      <div className="text-xs font-medium mb-2 text-muted-foreground">
        Selected Elements ({selectedElements.length})
      </div>
      <div className="space-y-1">
        {displayElements.map((el) => {
          const key = `${el.modelID}-${el.expressID}`;
          const isSelected = selectedElements.some(
            (sel) => sel.modelID === el.modelID && sel.expressID === el.expressID
          );
          return (
            <div
              key={key}
              className="flex items-center gap-2 hover:bg-accent/50 rounded px-2 py-1 transition-colors"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggleElement(el)}
                className="h-3.5 w-3.5 flex-shrink-0 dark:text-blue-400 text-blue-600 "
              />
              <label
                className="text-xs truncate flex-1 cursor-pointer select-none"
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleElement(el);
                }}
              >
                {names[key] || `#${el.expressID}`}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}