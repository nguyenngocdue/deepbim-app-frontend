// src/context/types.ts
import type { IfcAPI } from "web-ifc";

// Rule types
export interface RuleCondition {
  property: string;
  operator: string;
  value: string | number | boolean;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  conditions: RuleCondition[];
  matchType?: "all" | "any";
  classificationCode: string;
  active: boolean;
}

// Spatial tree node
export interface SpatialStructureNode {
  expressID: number;
  type: string;
  children: SpatialStructureNode[];
  GlobalId?: any;
  Name?: any;
  [key: string]: any;
}

// Loaded model data
export interface LoadedModelData {
  id: string;
  name: string;
  url: string;
  modelID: number | null;
  spatialTree: SpatialStructureNode | null;
  rawBuffer: ArrayBuffer | null;
}

// Selected element
export interface SelectedElementInfo {
  modelID: number;
  expressID: number;
}

// Classification item
export interface ClassificationItem {
  code: string;
  name: string;
  color: string;
  elements?: SelectedElementInfo[];
}

// Context type
export interface IFCContextType {
  loadedModels: LoadedModelData[];
  selectedElement: SelectedElementInfo | null;
  selectedElements: SelectedElementInfo[];
  highlightedElements: SelectedElementInfo[];
  elementProperties: any | null;
  availableCategories: Record<number, string[]>;
  classifications: Record<string, ClassificationItem>;
  rules: Rule[];
  ifcApi: IfcAPI | null;
  highlightedClassificationCode: string | null;
  showAllClassificationColors: boolean;
  previewingRuleId: string | null;
  userHiddenElements: SelectedElementInfo[];
  availableProperties: string[];
  setAvailableProperties: (props: string[]) => void;
  baseCoordinationMatrix: number[] | null;
  setBaseCoordinationMatrix: (matrix: number[] | null) => void;
  naturalIfcClassNames: Record<string, { en: string; de: string; schema?: string }> | null;
  getNaturalIfcClassName: (ifcClass: string, lang?: "en" | "de") => { name: string; schemaUrl?: string };
  replaceIFCModel: (url: string, name: string, fileId?: string) => Promise<number | null>;
  addIFCModel: (url: string, name: string, fileId?: string) => Promise<number | null>;
  removeIFCModel: (id: string) => void;
  setModelIDForLoadedModel: (loadedModelId: string, ifcModelId: number) => void;
  setSpatialTreeForModel: (modelID: number, tree: SpatialStructureNode | null) => void;
  setRawBufferForModel: (id: string, buffer: ArrayBuffer) => void;
  selectElement: (selection: SelectedElementInfo | null) => void;
  selectElements: (selection: SelectedElementInfo[]) => void;
  toggleElementSelection: (element: SelectedElementInfo, additive: boolean) => void;
  clearSelection: () => void;
  toggleClassificationHighlight: (classificationCode: string) => void;
  setElementProperties: (properties: any | null) => void;
  setAvailableCategoriesForModel: (modelID: number, categories: string[]) => void;
  setIfcApi: (api: IfcAPI | null) => void;
  getElementPropertiesCached: (modelID: number, expressID: number) => Promise<any | null>;
  toggleShowAllClassificationColors: () => void;
  addClassification: (classification: ClassificationItem) => void;
  removeClassification: (code: string) => void;
  removeAllClassifications: () => void;
  updateClassification: (code: string, classification: ClassificationItem) => void;
  assignClassificationToElement: (classificationCode: string, element: SelectedElementInfo) => void;
  unassignClassificationFromElement: (classificationCode: string, element: SelectedElementInfo) => void;
  unassignElementFromAllClassifications: (element: SelectedElementInfo) => void;
  toggleUserHideElement: (element: SelectedElementInfo) => void;
  unhideLastElement: () => void;
  unhideAllElements: () => void;
  hiddenModelIds: string[];
  toggleModelVisibility: (modelId: string) => void;
  hideElements: (elements: SelectedElementInfo[]) => void;
  showElements: (elements: SelectedElementInfo[]) => void;
  getClassificationsForElement: (element: SelectedElementInfo | null) => ClassificationItem[];
  mapClassificationsFromModel: (psetName: string, propertyName: string) => Promise<void>;
  addRule: (rule: Rule) => void;
  removeRule: (id: string) => void;
  updateRule: (rule: Rule) => void;
  previewRuleHighlight: (ruleId: string) => Promise<void>;
  exportClassificationsAsJson: () => string;
  importClassificationsFromJson: (json: string) => void;
  exportClassificationsAsExcel: () => ArrayBuffer;
  importClassificationsFromExcel: (file: File) => Promise<void>;
  exportRulesAsJson: () => string;
  exportRulesAsExcel: () => ArrayBuffer;
  importRulesFromJson: (json: string) => void;
  importRulesFromExcel: (file: File) => Promise<void>;
  removeAllRules: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (value: number) => void;
  loadingMessage: string;
  setLoadingMessage: (value: string) => void;
}