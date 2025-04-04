import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import { worldManager } from "@/services/WorldManager";
import { modelManager } from "@/services/ModelManager";
import { processPropertySets } from "./helpers/ProcessPropertySets";
import { processEntityAttributes } from "./helpers/ProcessAttribbutes";
import { processMaterialRelations } from "./helpers/ProcessMaterials";
import { processSpatialContainers } from "./helpers/SpatialContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Interface cho mỗi node trong cây
interface TreeNode {
  name: string;
  value?: string;
  children?: TreeNode[];
}



const TreeAccordion: React.FC<{ data: TreeNode[] }> = ({ data }) => {
  // Tạo danh sách nodeId mở mặc định
  const allNodeIds = getAllNodeIds(data);

  return (
    <Accordion type="multiple" defaultValue={allNodeIds} className="w-full">
      {data.map((node, index) => (
        <TreeItem node={node} key={index} parentKey={`node-${index}`} />
      ))}
    </Accordion>
  );
};

const TreeItem: React.FC<{ node: TreeNode; parentKey: string }> = ({ node, parentKey }) => {
  const id = `${parentKey}-${node.name}`;

  const isLeafGroup =
    node.children &&
    node.children.length > 0 &&
    node.children.every((child) => !child.children);

  if (isLeafGroup) {
    return (
      <AccordionItem value={id}>
        <AccordionTrigger className="uppercase text-xs  text-zinc-400 tracking-wide font-bold ">
          {node.name}
        </AccordionTrigger>
        <AccordionContent>
          <table className="min-w-full text-left text-sm border border-zinc-800 rounded-md overflow-hidden">
            <tbody>
              {node.children!.map((child, index) => (
                <tr
                  key={index}
                  className="  hover:bg-zinc-800 transition-colors"
                >
                  <td className="px-3 py-2 font-medium text-white w-1/3 border border-zinc-600">{child.name}</td>
                  <td className="px-3 py-2 text-zinc-300 border border-zinc-600 ">{child.value ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionContent>
      </AccordionItem>
    );
  }

  if (node.children && node.children.length > 0) {
    return (
      <AccordionItem value={id}>
        <AccordionTrigger className="uppercase text-xs  text-zinc-400 tracking-wide font-bold">
          {node.name}
        </AccordionTrigger>
        <AccordionContent>
          <Accordion type="multiple" defaultValue={getAllNodeIds(node.children)} className="pl-3">
            {node.children.map((child, idx) => (
              <TreeItem node={child} key={idx} parentKey={`${id}-${idx}`} />
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <div className="pl-6 py-1 text-sm text-zinc-300">
      <span className="font-medium text-white">{node.name}</span>
      {node.value && `: ${node.value}`}
    </div>
  );
};

// 🔧 Hàm lấy tất cả nodeId để mở mặc định
const getAllNodeIds = (nodes: TreeNode[], prefix = "node"): string[] => {
  const ids: string[] = [];

  const walk = (nodes: TreeNode[], parentKey: string) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const id = `${parentKey}-${node.name}`;
      ids.push(id);
      if (node.children && node.children.length > 0) {
        walk(node.children, `${id}-${i}`);
      }
    }
  };

  walk(nodes, prefix);
  return ids;
};


const ElementProperties: React.FC = () => {
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

      highlighter.events.select.onHighlight.add(async (fragmentIdMap: any) => {
        const modelID = Object.keys(fragmentIdMap)[0];
        const fragmentID = Array.from(fragmentIdMap[modelID])[0] as number;

        const definedByRelations = indexer.getEntityRelations(model, fragmentID, "IsDefinedBy");
        const expressIDs = [...new Set(definedByRelations)];

        const propertySets = await processPropertySets(model, expressIDs); // Trả về TreeNode
        const entityAttributes = await processEntityAttributes(model, fragmentID); // TreeNode
        const entityMaterials = await processMaterialRelations(components, model, fragmentID); // TreeNode
        const spatialContainer = await processSpatialContainers(components, model, fragmentID); // TreeNode

        const combined: TreeNode[] = [
          entityAttributes,
          propertySets,
          entityMaterials,
          spatialContainer,
        ].filter(Boolean);

        setTreeData(combined);
      });
    };

    init();
  }, []);

  return (
    <div className="flex w-full h-screen ">
      <div className="w-full overflow-auto p-3 text-white text-sm bg-panel-50">
        {treeData.length > 0 ? (
          <TreeAccordion data={treeData} />
        ) : (
          <div className="text-zinc-400 text-center mt-10 px-4 leading-relaxed">
            🧱 No element selected yet.
            <br />
            Click on a model element to view its detailed properties.
          </div>
        )}
      </div>
      <div className="flex-1" id="viewport" />
    </div>

  );
};

export default ElementProperties;
