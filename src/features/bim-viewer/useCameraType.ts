import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from "three";

interface useCameraType {
    isOrthoPerspective: boolean;
    worldRef: React.RefObject<OBC.World | null>;
}

export  function useCameraType({
    isOrthoPerspective,
    worldRef,
}: useCameraType): void {
    if ( !worldRef ) return;

    
    const projection = worldRef.current.camera.projection; 
    if (isOrthoPerspective) {
        projection.set("Orthographic")
    } else {
        projection.set("Perspective")

    }

}

