import * as React from "react";
import * as OBC from "@thatopen/components";
import { worldManager } from "@/services/WorldManager";
import { toggleClassificationTreeVisibility } from "@/features/bim-viewer/toggleClassificationTreeVisibility";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import * as THREE from 'three';

// Component hiển thị cây phân loại tùy chỉnh
function ClassificationTreeCustom({
  classifierData,
  fragmentsManager,
}: {
  classifierData: any;
  fragmentsManager: any;
}) {
  const [groups, setGroups] = React.useState<
    { label: string; items: any[] }[]
  >([]);
  React.useEffect(() => {
    if (!classifierData?.list) return;

    const entitiesRaw = classifierData.list.entities || {};
    const predefinedRaw = classifierData.list.predefinedTypes || {};

    const entities = Array.isArray(entitiesRaw)
      ? entitiesRaw
      : Object.values(entitiesRaw);

    const predefined = Array.isArray(predefinedRaw)
      ? predefinedRaw
      : Object.values(predefinedRaw);


    setGroups([
      { label: "Entities", items: entities },
      { label: "Predefined Types", items: predefined },
    ]);
  }, [classifierData]);

const handleToggle = (groupItem: any, visible: boolean) => {
    toggleClassificationTreeVisibility(groupItem, visible, fragmentsManager);
  };


  const highlighter = worldManager.getHighlightSetup();
  if (!highlighter.selection["hovering"]) {
    highlighter.add("hovering", new THREE.Color(0xFF00FF)); // Cyan màu hover
  }
  
  const handleHover = (item: any) => {
    highlighter.highlightByID("hovering",item.map);
  };
  
  const clearHover = () => {
    highlighter?.clear("hovering");
  };
  

  return (
    <ScrollArea className="h-full w-full">
      <div className="text-white text-sm p-4 space-y-6">
        <h2 className="text-xl  pb-2 border-b border-zinc-700">Classification Tree</h2>
        {groups.map((group) => (
          <div key={group.label} className="space-y-3">
            <h3 className="uppercase text-xs  text-zinc-400 tracking-wide">
              {group.label}
            </h3>

            <div className="space-y-2 ">
              {group.items.map((item: any, index: number) => {
                const key = item.id || item.name || `${group.label}-${index}`;
                return (
                  <div
                    onMouseEnter={() => handleHover(item)}
                    onMouseLeave={clearHover}
                    key={key}
                    className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors"
                  >
                    <Checkbox
                      id={key}
                      defaultChecked
                      onCheckedChange={(checked) =>
                        handleToggle(item, !!checked)
                      }
                    />
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

            <Separator className="bg-zinc-700" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default function ClassificationsTree() {
  const [classifierData, setClassifierData] = React.useState<any>(null);
  const [fragmentsManager, setFragmentsManager] = React.useState<any>(null);

  React.useEffect(() => {
    const components = worldManager.getComponents();
    if(!components) return;
    const classifier = components.get(OBC.Classifier);
    const fragments = components.get(OBC.FragmentsManager);

    fragments.onFragmentsLoaded.add(async (model) => {
      console.log(model)
      await classifier.byEntity(model);
      await classifier.byPredefinedType(model);

      setClassifierData(classifier);
      setFragmentsManager(fragments);
    });
  }, []);
  console.log(classifierData);

  return (
    <div className="w-full h-full">
      {classifierData && fragmentsManager && (
        <ClassificationTreeCustom
          classifierData={classifierData}
          fragmentsManager={fragmentsManager}
        />
      )}
    </div>
  );
}
