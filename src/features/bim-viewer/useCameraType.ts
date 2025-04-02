import { worldManager } from "@/services/WorldManager";

interface useCameraType {
    isOrthoPerspective: boolean;
}

export  function useCameraType({
    isOrthoPerspective,
}: useCameraType): void {
    
    const world = worldManager.getWorld();
    if ( !world ) return;
    if (isOrthoPerspective) {
        worldManager.changeCameraType(true);
    } else {
        worldManager.changeCameraType(false);
    }

}

