import { gridManager } from "@/services/GridManager";



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
