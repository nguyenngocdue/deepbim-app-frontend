import * as React from "react";
import * as OBC from "@thatopen/components";
import { worldManager } from "@/services/WorldManager";
import { toggleClassificationTreeVisibility } from "@/features/bim-viewer/toggleClassificationTreeVisibility";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import * as THREE from 'three';

// Custom classification tree component
function ClassificationTreeCustom({
  classifierData,
  fragmentsManager,
}: {
  classifierData: any;
  fragmentsManager: any;
}) {
  // State for storing groupings: Entities and Predefined Types
  const [groups, setGroups] = React.useState<
    { label: string; items: any[] }[]
  >([]);

  // Process the classifier data when it becomes available
  React.useEffect(() => {
    if (!classifierData?.list) return;

    const entitiesRaw = classifierData.list.entities || {};
    const predefinedRaw = classifierData.list.predefinedTypes || {};

    // Normalize to arrays
    const entities = Array.isArray(entitiesRaw)
      ? entitiesRaw
      : Object.values(entitiesRaw);

    const predefined = Array.isArray(predefinedRaw)
      ? predefinedRaw
      : Object.values(predefinedRaw);

    // Set groupings for rendering
    setGroups([
      { label: "Entities", items: entities },
      { label: "Predefined Types", items: predefined },
    ]);
  }, [classifierData]);

  // Toggle visibility when checkbox is changed
  const handleToggle = (groupItem: any, visible: boolean) => {
    toggleClassificationTreeVisibility(groupItem, visible, fragmentsManager);
  };

  // Set up highlighting for hover interactions
  const highlighter = worldManager.getHighlightSetup();
  if (!highlighter.selection["hovering"]) {
    highlighter.add("hovering", new THREE.Color(0xFF00FF)); // Pink highlight color
  }

  // Highlight item on hover
  const handleHover = (item: any) => {
    highlighter.highlightByID("hovering", item.map);
  };

  // Clear highlight when mouse leaves item
  const clearHover = () => {
    highlighter?.clear("hovering");
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="text-white text-sm p-4 space-y-6">
        <h2 className="text-xl pb-2 border-b border-zinc-700">
          Classification Tree
        </h2>

        {/* Loop through and render each group */}
        {groups.map((group) => (
          <div key={group.label} className="space-y-3">
            <h3 className="uppercase text-xs text-zinc-400 tracking-wide">
              {group.label}
            </h3>

            <div className="space-y-2">
              {group.items.map((item: any, index: number) => {
                const key = item.id || item.name || `${group.label}-${index}`;
                return (
                  <div
                    onMouseEnter={() => handleHover(item)}
                    onMouseLeave={clearHover}
                    key={key}
                    className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors"
                  >
                    {/* Checkbox to toggle visibility */}
                    <Checkbox
                      id={key}
                      defaultChecked
                      onCheckedChange={(checked) =>
                        handleToggle(item, !!checked)
                      }
                    />
                    {/* Label for the item */}
                    <Label
                      htmlFor={key}
                      className="text-zinc-100 cursor-pointer truncate"
                    >
                      {item.name}
                    </Label>
                  </div>
                );
              })}
            </div>

            {/* Divider between groups */}
            <Separator className="bg-zinc-700" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

// Main component that initializes the classifier and passes data to the tree
export default function ClassificationsTree() {
  const [classifierData, setClassifierData] = React.useState<any>(null);
  const [fragmentsManager, setFragmentsManager] = React.useState<any>(null);

  // When the model is loaded, classify it and store the result
  React.useEffect(() => {
    const components = worldManager.getComponents();
    if (!components) return;

    const classifier = components.get(OBC.Classifier);
    const fragments = components.get(OBC.FragmentsManager);

    // Listen for fragment loading and classify
    fragments.onFragmentsLoaded.add(async (model) => {
      console.log(model);
      await classifier.byEntity(model);            // Classify by Entity
      await classifier.byPredefinedType(model);    // Classify by Predefined Type

      // Save references to state
      setClassifierData(classifier);
      setFragmentsManager(fragments);
    });
  }, []);

  console.log(classifierData); // Debug log

  return (
    <div className="w-full h-full">
      {/* Render only after data is available */}
      {classifierData && fragmentsManager && (
        <ClassificationTreeCustom
          classifierData={classifierData}
          fragmentsManager={fragmentsManager}
        />
      )}
    </div>
  );
}
