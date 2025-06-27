// Make sure to import or define ifcApi before using it
// import { ifcApi } from 'path-to-ifcApi'; // Uncomment and update the path as needed

export interface SelectedElement {
  modelID: number;
  expressID: number;
}

export interface IfcElement {
  // Define properties as needed, using 'any' as a placeholder
  [key: string]: any;
}

export interface IfcApi {
  GetLine(
    modelID: number,
    expressID: number,
    flatten?: boolean,
    recursive?: boolean
  ): IfcElement;
}

export function getLineProperties(
  selectedElement: SelectedElement,
  ifcApi: IfcApi
): IfcElement {
  const element: IfcElement = ifcApi.GetLine(
    selectedElement.modelID,
    selectedElement.expressID,
    true,
    true
  );
  return element;
}