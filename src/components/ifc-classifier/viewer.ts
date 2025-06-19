import * as THREE from "three";
import { IfcAPI } from "web-ifc";

export interface SelectedElementInfo {
  modelID: number;
  expressID: number;
}

export interface SpatialStructureNode {
  expressID?: number;
  type?: string;
  GlobalId?: { value: string };
  Name?: { value: string };
  children?: SpatialStructureNode[];
  [key: string]: any;
}

export interface LoadedModelData {
  id: string;
  name: string;
  modelID: number | null;
  model: THREE.Group | null;
  ifcModel: any;
  spatialTree: SpatialStructureNode | null;
  url: string;
}

export interface IFCContextType {
  ifcApi: IfcAPI | null;
  setIfcApi: (api: IfcAPI) => void;
  loadedModels: LoadedModelData[];
  addIFCModel: (url: string, name: string) => void;
  replaceIFCModel: (url: string, name: string) => void;
  selectedElement: SelectedElementInfo | null;
  selectedElements: SelectedElementInfo[];
  selectElement: (element: SelectedElementInfo | null) => void;
  selectElements: (elements: SelectedElementInfo[]) => void;
  toggleElementSelection: (element: SelectedElementInfo, additive?: boolean) => void;
  clearSelection: () => void;
  userHiddenElements: SelectedElementInfo[];
  toggleUserHideElement: (element: SelectedElementInfo) => void;
  unhideLastElement: () => void;
  unhideAllElements: () => void;
  hideElements: (elements: SelectedElementInfo[]) => void;
  showElements: (elements: SelectedElementInfo[]) => void;
  getElementPropertiesCached: (
    modelID: number,
    expressID: number
  ) => Promise<any>;
}