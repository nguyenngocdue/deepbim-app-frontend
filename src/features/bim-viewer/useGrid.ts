import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface Grids {
  config: {
    visible: boolean;
    color?: THREE.Color;
    primarySize?: number;
    secondarySize?: number;
  };
  fade?: boolean;
}


interface GridsProps {
  haveGrids: boolean;
  worldRef: React.RefObject<OBC.World | null>;
  gridRef: React.RefObject<Grids | null>;
}


export function useGrids({
  haveGrids,
  worldRef,
  gridRef,
}: GridsProps): void {

  const grid = gridRef.current;
  if (!grid) return;
  
  grid.config.visible = haveGrids


  if (haveGrids) {
    grid.config.color = new THREE.Color("#bbbbbb")
    grid.config.primarySize = 1;
    grid.config.secondarySize = 10;
    grid.config.visible = true;
    // Điều chỉnh fade dựa trên chế độ camera
    if (worldRef.current) {
      const camera = worldRef.current.camera as OBC.BaseCamera;
      if (camera) grid.fade = camera.projection.current === "Perspective";
    }
  }

}
