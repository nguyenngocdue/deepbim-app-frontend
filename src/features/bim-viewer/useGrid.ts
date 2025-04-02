import { gridManager } from "@/services/GridManager";
import * as OBC from "@thatopen/components";
import React from "react";



interface GridsProps {
  haveGrids: boolean;
}

export function useGrids({
  haveGrids,
}: GridsProps): void {

  if(haveGrids){
    gridManager.updateGridVisibility(true);
  }else{
    gridManager.updateGridVisibility(false);
  }
  
}
