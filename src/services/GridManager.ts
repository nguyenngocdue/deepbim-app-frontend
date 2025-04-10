import * as OBC from "@thatopen/components";
import * as THREE from 'three';

// Define the data type for worldGrid
interface WorldGrid {
    material: {
        uniforms: {
            uColor: { value: THREE.Color };
            uSize1: { value: number };
            uSize2: { value: number };
        };
        visible: boolean;
    };
}

// Singleton class
class GridManager {
    private static instance: GridManager; // Static variable to store the instance
    private worldGrid: WorldGrid | null = null; // Store the worldGrid

    // Private constructor to prevent creating multiple instances
    private constructor() {}

    // Method to get the single instance of GridManager
    public static getInstance(): GridManager {
        if (!GridManager.instance) {
            GridManager.instance = new GridManager();
        }
        return GridManager.instance;
    }

    // Method to create a grid
    public createGrid(components: OBC.Components, world: any): void {
        const grid = components.get(OBC.Grids).create(world);
        grid.material.uniforms.uColor.value = new THREE.Color(0x444444);
        grid.material.uniforms.uSize1.value = 2;
        grid.material.uniforms.uSize2.value = 8;
        grid.visible = true;

        this.worldGrid = grid; // Store the grid in the instance
        console.warn("Grid has been created and stored in the singleton service.");
    }

    // Method to retrieve the worldGrid
    public getWorldGrid(): WorldGrid | null {
        return this.worldGrid;
    }

    // Method to update the visibility of the grid (show/hide)
    public updateGridVisibility(isVisible: boolean): void {
        if (this.worldGrid) {
            this.worldGrid.visible = isVisible; // Update the visibility state
            console.warn(`Grid visibility updated to: ${isVisible}`);
        } else {
            console.warn("No grid found. Please create a grid first.");
        }
    }

    // Method to check the current visibility state of the grid
    public isGridVisible(): boolean {
        return this.worldGrid ? this.worldGrid.visible : false;
    }
}

// Export the single instance of GridManager
export const gridManager = GridManager.getInstance();