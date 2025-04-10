import { gridService } from "@/services/GridManager";

export function hideGrid(): void {
    gridService.toggleGridVisibility(false); // Tắt grid
    console.log("Grid has been hidden.");
}

export function showGrid(): void {
    gridService.toggleGridVisibility(true); // Bật grid
    console.log("Grid has been shown.");
}

export function checkGridState(): void {
    const grid = gridService.getWorldGrid();
    if (grid) {
        console.log(`Grid visibility: ${grid.visible}`);
    } else {
        console.log("Grid is not initialized.");
    }
}