import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import { worldManager } from "@/services/WorldManager";
import { modelManager } from "@/services/ModelManager";
import * as WEBIFC from "web-ifc";

// Interface cho mỗi node trong cây
interface TreeNode {
  name: string;
  value?: string;
  children?: TreeNode[];
}



const ElementProperties2: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    const init = async () => {
      const components = worldManager.getComponents();
      if (!components) return;

      const model = await modelManager.waitForModel();
      const indexer = components.get(OBC.IfcRelationsIndexer);
      await indexer.process(model);

      const highlighter = worldManager.getHighlightSetup();
      const fragmentManager = components.get(OBC.FragmentsManager);

      const ifcMetadata = model.ifcMetadata;


      highlighter.events.select.onHighlight.add(async (fragmentIdMap: any) => {
        const modelID = Object.keys(fragmentIdMap)[0];
        const model = await modelManager.waitForModel();
        const expressID  = Array.from(fragmentIdMap[modelID])[0] as number;
        const props = await model.getProperties(expressID, true);
        console.log(props);
      });
    };

    init();
  }, []);

  return (
    <div className="flex w-full h-screen ">
      <div className="w-full overflow-auto p-3 text-white text-sm bg-panel-50">
       AAAA
      </div>
      <div className="flex-1" id="viewport" />
    </div>

  );
};

export default ElementProperties2;
