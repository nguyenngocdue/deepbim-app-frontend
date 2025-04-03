import * as React from "react";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import { worldManager } from "@/services/WorldManager";
import { toggleGroupItemVisibility } from "@/features/bim-viewer/toggleGroupItemVisibility";

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
    toggleGroupItemVisibility(groupItem, visible, fragmentsManager);
  };



  return (
    <div className="text-white p-4">
      <h2 className="text-lg font-semibold mb-4">Classification Tree</h2>
      {groups.map((group) => (
        <div key={group.label} className="mb-4">
          <h3 className="font-bold mb-2">{group.label}</h3>
          <ul className="pl-2">
            {group.items.map((item: any, index: number) => {
              const key = item.id || item.name || `${group.label}-${index}`;
              return (
                <li key={key} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    defaultChecked
                    onChange={(e) =>
                      handleToggle(item, e.target.checked)
                    }
                  />
                  <label className="select-none cursor-pointer">
                    {item.name}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function ClassificationsTreeApp() {
  const [classifierData, setClassifierData] = React.useState<any>(null);
  const [fragmentsManager, setFragmentsManager] = React.useState<any>(null);

  React.useEffect(() => {
    BUI.Manager.init();

    const components = worldManager.getComponents();
    const ifcLoader = components.get(OBC.IfcLoader);
    const classifier = components.get(OBC.Classifier);
    const fragments = components.get(OBC.FragmentsManager);

    ifcLoader.setup();

    fragments.onFragmentsLoaded.add(async (model) => {
      await classifier.byEntity(model);
      await classifier.byPredefinedType(model);

      setClassifierData(classifier);
      setFragmentsManager(fragments);
    });
  }, []);

  return (
    <div className="flex w-full h-screen">
      <div className="w-80 bg-zinc-900 overflow-auto">
        {classifierData && fragmentsManager && (
          <ClassificationTreeCustom
            classifierData={classifierData}
            fragmentsManager={fragmentsManager}
          />
        )}
      </div>
      <div className="flex-1" id="viewport" />
    </div>
  );
}
