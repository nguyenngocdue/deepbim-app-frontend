import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from "three";

interface useCameraType {
    isOrthoPerspective: boolean;
    componentRef: React.RefObject<OBC.Components | null>;
    worldRef: React.RefObject<OBC.World | null>;
    ifcContainerRef: React.RefObject<HTMLDivElement | null>;
    modelRef: React.RefObject<THREE.Object3D | null>;
}

export async function useCameraType({
    isOrthoPerspective,
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef,
}: useCameraType): Promise<void> {
    const components = componentRef.current;
    const world = worldRef.current;
    const container = ifcContainerRef.current;
    const model = modelRef.current;

    if (!components || !world || !container || !model) return;

    if (isOrthoPerspective) {
        console.log(isOrthoPerspective)
        for (const child of model.children) {
            if (child instanceof THREE.Mesh) {
                world.meshes.add(child);
            }
        }
    }

}

