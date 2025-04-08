import { useEffect, useState } from "react";
import { worldManager } from "@/services/WorldManager";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import * as OBF from "@thatopen/components-front";
import { modelManager } from "@/services/ModelManager";
import { processEntityAttributes } from "@/components/bim-viewer/element-properties/helpers/ProcessAttribbutes";
import { processPropertySets } from "@/components/bim-viewer/element-properties/helpers/ProcessPropertySets";


export function useSelections() {
  const [highlighter, setHighlighter] = useState<any>(null);

  useEffect(() => {
    // Get the highlighter tool from worldManager
    const highlight = worldManager.getHighlightSetup();
    if (!highlight) {
      console.warn("⚠️ Highlighter is not ready – is worldManager initialized?");
      return;
    }
    setHighlighter(highlight);
  }, []);


  const isolate = () => {
    // Get all required components from worldManager
    const components = worldManager.getComponents();
    if (!components) {
      console.warn("⚠️ Components not ready – is worldManager initialized?");
      return;
    }
    const cullers = components.get(OBC.Cullers);
    const hider = components.get(OBC.Hider);
    const streamer = components.get(OBF.IfcStreamer);
    const fragments = components.get(OBC.FragmentsManager);
    // Get currently selected fragments
    const selection = highlighter.selection.select;
    if (Object.keys(selection).length === 0) return;

    const meshes = new Set<THREE.InstancedMesh>();

    // Fragment maps for visibility control
    const streamedFragsToHide: FRAGS.FragmentIdMap = {};
    const streamedFragsToShow: FRAGS.FragmentIdMap = {};
    const staticFragsToShow: FRAGS.FragmentIdMap = {};

    // First, hide all fragments
    for (const [, fragment] of fragments.list) {
      if (fragment.group?.isStreamed) {
        // For streamed fragments, prepare to hide via streamer
        streamedFragsToHide[fragment.id] = new Set(fragment.ids);
        continue;
      }

      // For static fragments, hide directly and collect their meshes
      fragment.setVisibility(false);
      meshes.add(fragment.mesh);
    }

    // Then, go through the selected fragments to determine which ones to show again
    for (const fragmentID in selection) {
      const fragment = fragments.list.get(fragmentID);
      if (!fragment) continue;

      if (fragment.group?.isStreamed) {
        streamedFragsToShow[fragmentID] = selection[fragmentID];
      } else {
        staticFragsToShow[fragmentID] = selection[fragmentID];
      }
    }

    // Show static fragments via hider and update mesh culling
    if (Object.keys(staticFragsToShow).length) {
      hider.set(true, selection);
      cullers.updateInstanced(meshes);
    }

    // Update visibility of streamed fragments using the streamer
    if (
      Object.keys(streamedFragsToHide).length ||
      Object.keys(streamedFragsToShow).length
    ) {
      streamer.setVisibility(false, streamedFragsToHide);
      streamer.setVisibility(true, streamedFragsToShow);
    }
  };

  const onToggleVisibility = () => {
    // Get all required components from worldManager
    const components = worldManager.getComponents();
    if (!components) {
      console.warn("⚠️ Components not ready – is worldManager initialized?");
      return;
    }
    const cullers = components.get(OBC.Cullers);
    const streamer = components.get(OBF.IfcStreamer);
    const fragments = components.get(OBC.FragmentsManager);

    // Get currently selected fragments
    const selection = highlighter.selection.select;
    if (Object.keys(selection).length === 0) {
      return;
    }

    const meshes = new Set<THREE.InstancedMesh>();
    const streamedFrags: FRAGS.FragmentIdMap = {};

    // Loop through selected fragment IDs
    for (const fragmentID in selection) {
      const fragment = fragments.list.get(fragmentID);
      if (!fragment) continue;

      // Handle streamed fragments separately
      if (fragment.group?.isStreamed) {
        streamedFrags[fragmentID] = selection[fragmentID];
        continue;
      }

      // For static fragments:
      // Toggle visibility per express ID
      meshes.add(fragment.mesh);
      const expressIDs = selection[fragmentID];
      for (const id of expressIDs) {
        const isHidden = fragment.hiddenItems.has(id);
        fragment.setVisibility(isHidden, [id]);
      }
    }

    // Update instanced mesh culling after visibility change
    if (meshes.size) {
      cullers.updateInstanced(meshes);
    }

    // For streamed fragments, toggle visibility via streamer
    if (Object.keys(streamedFrags).length) {
      for (const fragmentID in streamedFrags) {
        const fragment = fragments.list.get(fragmentID);
        if (!fragment) continue;

        const ids = streamedFrags[fragmentID];
        for (const id of ids) {
          const isHidden = fragment.hiddenItems.has(id);
          streamer.setVisibility(isHidden, {
            [fragment.id]: new Set([id]),
          });
        }
      }
    }
  };

  const onShowAll = () => {
    // Retrieve all required components from the worldManager
    const components = worldManager.getComponents();
    if (!components) return;

    const streamer = components.get(OBF.IfcStreamer);
    const fragments = components.get(OBC.FragmentsManager);
    const cullers = components.get(OBC.Cullers);

    // Map to store streamed fragments that need to be shown
    const streamedFragsToShow: FRAGS.FragmentIdMap = {};

    // Iterate through each fragment in the fragments list
    for (const [, fragment] of fragments.list) {
      if (fragment.group?.isStreamed) {
        // For streamed fragments, add them to the map for showing via the streamer
        streamedFragsToShow[fragment.id] = new Set(fragment.ids);
      } else {
        // For static fragments, directly set their visibility to true
        fragment.setVisibility(true);

        // Update culling information for the fragment's mesh
        for (const [, culler] of cullers.list) {
          const culled = culler.colorMeshes.get(fragment.id);
          if (culled) {
            culled.count = fragment.mesh.count;
          }
        }
      }
    }


    // If there are any streamed fragments to show, update their visibility via the streamer
    if (Object.keys(streamedFragsToShow).length) {
      streamer.setVisibility(true, streamedFragsToShow);
    }
  };

  const onHide = () => {
    const components = worldManager.getComponents();
    if (!components) {
      console.warn("⚠️ Components not ready – is worldManager initialized?");
      return;
    }
    const selection = highlighter.selection.select;
    const [uuid, expressIDs] = Object.entries(selection)[0];
    if (Object.keys(selection).length === 0) return;
    const fragments = components.get(OBC.FragmentsManager);
    for (const [, fragment] of fragments.list) {
      if(fragment.id == uuid) {
        console.log(fragment);
        fragment.setVisibility(false);
      }
    }
  }


  const onHideByCategory = async () => {
    const components = worldManager.getComponents();
    if (!components) return;
  
    const fragments = components.get(OBC.FragmentsManager);
  
    const selection = highlighter.selection.select;
    if (Object.keys(selection).length === 0) return;
  
    const [fragmentID, expressIDs] = Object.entries(selection)[0];
    const expressID = Array.from(expressIDs)[0];
    const model = await modelManager.waitForModel();
    const entityAttrs = await model.getProperties(expressID);
   
    if (Object.keys(selection).length === 0) return;

    for (const [, fragment] of fragments.list) {
     
      console.log(selection, entityAttrs, fragment);
    }

  }


  return { isolate, onToggleVisibility, onShowAll, onHide, onHideByCategory };
}
