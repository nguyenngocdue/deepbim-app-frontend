import React, { useEffect, useRef } from "react";
import * as OBC from "@thatopen/components";
import * as BUIC from "@thatopen/ui-obc";
import { worldManager } from "@/services/WorldManager";
import { modelManager } from "@/services/ModelManager";
import { processPropertySets } from "./helpers/ProcessPropertySets";
import { processEntityAttributes } from "./helpers/ProcessAttribbutes";
import { processMaterialRelations } from "./helpers/ProcessMaterials";
import { processSpatialContainers } from "./helpers/SpatialContainer";

import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ElementProperties: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const components = worldManager.getComponents();
      if(!components) return;

      const model = await modelManager.waitForModel(); 
      const indexer = components.get(OBC.IfcRelationsIndexer);
      await indexer.process(model);
  
      const highlighter = worldManager.getHighlightSetup();
      const fragmentManager = components.get(OBC.FragmentsManager);


      highlighter.events.select.onHighlight.add(async (fragmentIdMap : any) => {
        const modelID = Object.keys(fragmentIdMap)[0];
        const fragmentID = Array.from(fragmentIdMap[modelID])[0] as number;

        const definedByRelations  = indexer.getEntityRelations(model, fragmentID, "IsDefinedBy");
        const expressIDs = [...new Set(definedByRelations)];
      
        const propertySets = await processPropertySets(model, expressIDs);
        const entityAttributes = await processEntityAttributes(model, fragmentID);
        const entityMaterials = await processMaterialRelations(components, model, fragmentID);
        const spatialContainer = await processSpatialContainers(components, model, fragmentID);  
        
        console.log(propertySets,entityAttributes,entityMaterials,spatialContainer)
      });
      
    };

    init();
  }, []);

  return (
    <div className="flex w-full h-screen">
      <div className="w-80 bg-zinc-900 overflow-auto">
      <TreeView
          aria-label="bim-tree"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: '100%', flexGrow: 1, overflowY: 'auto' }}
        >
          <TreeItem nodeId="1" label="Muro básico:Partición con capa de yeso:163541">
            <TreeItem nodeId="2" label="Attributes">
              <TreeItem nodeId="3" label="Class: IFCWALLSTANDARDCASE" />
              <TreeItem nodeId="4" label="GlobalId: 2idC0G3ezCdhA9WVjWemc$" />
              <TreeItem nodeId="5" label="Name: Muro básico:Partición con capa de yeso:163541" />
              <TreeItem nodeId="6" label="ObjectType: Muro básico:Partición con capa de yeso" />
              <TreeItem nodeId="7" label="Tag: 163541" />
            </TreeItem>
            <TreeItem nodeId="8" label="PropertySets" />
            <TreeItem nodeId="9" label="Materials" />
            <TreeItem nodeId="10" label="Tasks" />
            <TreeItem nodeId="11" label="SpatialContainer" />
          </TreeItem>
        </TreeView>



      </div>
      <div className="flex-1" id="viewport" />
    </div>
  );
};

export default ElementProperties;


