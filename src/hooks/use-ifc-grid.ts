// useIfcGrid.ts
import { useEffect } from "react";
import * as OBC from "@thatopen/components";

export function useIfcGrid(components: OBC.Components | null, ifcWorld: OBC.World | null) {
    useEffect(() => {
        if (!components || !ifcWorld) return;

        const grids = components.get(OBC.Grids);
        grids.create(ifcWorld);
    }, [components, ifcWorld]);
}
