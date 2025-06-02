import { worldManager } from "@/services/WorldManager";
import * as OBC from "@thatopen/components";
import * as THREE from 'three';

interface WorldSettingsProps {
  haveWorldSettings: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
}

export function useWorldSettings({
  haveWorldSettings,
  worldRef
}: WorldSettingsProps): void {
  
  const world = worldRef.current;
  if(!world) return;
  if(haveWorldSettings){
    const bgColor =  0xE4F2DE;
    const hexColor = `#${bgColor.toString(16).padStart(6, '0')}`;
    localStorage.setItem('current_three_background', hexColor);
  } else {
    const bgColor =  0x020817;
    (world.scene.three as THREE.Scene).background = new THREE.Color(bgColor);
    const hexColor = `#${bgColor.toString(16).padStart(6, '0')}`;
    localStorage.setItem('current_three_background', hexColor);
  }
  let color = localStorage.getItem('current_three_background') ?? "#020817";
  (world.scene.three as THREE.Scene).background = new THREE.Color(color);
  world.renderer?.update();
}
