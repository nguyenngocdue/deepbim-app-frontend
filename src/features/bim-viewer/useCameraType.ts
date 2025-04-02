import { worldManager } from "@/services/WorldManager";

interface useCameraType {
    isOrthoPerspective: boolean;
}

export  function useCameraType({
    isOrthoPerspective,
}: useCameraType): void {
    
    const world = worldManager.getWorld();
    if ( !world ) return;
    const projection = world.camera.projection; 
    if (isOrthoPerspective) {
        // projection.set("Orthographic")
    } else {
        // worldManager.changeCameraType(true);
        // projection.set("Perspective")
    }

}

