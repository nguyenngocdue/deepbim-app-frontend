import * as OBC from "@thatopen/components";
import React from "react";



interface GridsProps {
  haveGrids: boolean;
  worldGridRef: React.RefObject<OBC.Grids | null>;
}


export function useGrids({
  haveGrids,
  worldGridRef,
}: GridsProps): void {

  if (!worldGridRef && !worldGridRef.current) return;
  const worldGrid = worldGridRef.current;
  console.log(worldGrid);
  if (!haveGrids) {
    // worldGrid.visible = false;
  }
}
