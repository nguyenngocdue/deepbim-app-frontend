import * as React from "react";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as BUIC from "@thatopen/ui-obc";
import { worldManager } from "@/services/WorldManager";

export default function ClassificationsTreeApp() {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const treeContainerRef = React.useRef<HTMLDivElement>(null);
  const [classifierData, setClassifierData] = React.useState<any>(null);

  React.useEffect(() => {
    BUI.Manager.init();

    const components = worldManager.getComponents();

    const ifcLoader = components.get(OBC.IfcLoader);
    ifcLoader.setup();

    const fragmentsManager = components.get(OBC.FragmentsManager);
    const classifier = components.get(OBC.Classifier);

    const [classificationsTree, updateClassificationsTree] =
      BUIC.tables.classificationTree({
        components,
        classifications: [],
      });

    fragmentsManager.onFragmentsLoaded.add(async (model) => {
      classifier.byEntity(model);
      await classifier.byPredefinedType(model);

      const classifications = [
        { system: "entities", label: "Entities" },
        { system: "predefinedTypes", label: "Predefined Types" },
      ];

      updateClassificationsTree({ classifications });
    });

    setClassifierData(classifier);

    if (treeContainerRef.current) {
      treeContainerRef.current.appendChild(classificationsTree);
    }
  }, []);
  console.log(treeContainerRef);

  return (
    <div className="h-full">
      <div className="h-full w-80 bg-zinc-900 text-white p-4 overflow-auto" ref={treeContainerRef}>
        <h2 className="text-lg font-semibold mb-2">Classification Tree</h2>
      </div>
    </div>
  );
}
