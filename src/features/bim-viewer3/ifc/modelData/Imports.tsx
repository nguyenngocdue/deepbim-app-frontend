
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import {
  useIFCContext,
  SpatialStructureNode,
  LoadedModelData,
  SelectedElementInfo,
} from "@/context/ifc/ifc-context";
import * as THREE from "three";
import {
  IfcAPI,
  IFCPROJECT,
  IFCSITE,
  IFCBUILDING,
  IFCBUILDINGSTOREY,
  IFCSPACE,
  IFCRELAGGREGATES,
  IFCRELCONTAINEDINSPATIALSTRUCTURE,
  IFCRELDEFINESBYPROPERTIES,
  IFCRELASSOCIATESMATERIAL,
  Properties,
} from "web-ifc";
import { addGrid, centerObjectAtOrigin, fitCameraToObject, setOtherLighting } from "./FitCameraToObject";

interface IFCModelProps {
  modelData: LoadedModelData;
  outlineLayer: number;
}