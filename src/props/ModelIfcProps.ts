export interface ModelIfcProps {
    onToggle:any,
    navigationMode: "Orbit" | "FirstPerson" | "Plan";
    isOrthoPerspective: boolean;
    coordinateSysActive: boolean;
    isClippingEdges: boolean;
    isEdgeMeasurement: boolean;
    isFaceMeasurement: boolean;
    haveGrids: boolean;
    hasVolumeMeasurement: boolean;
    havePlansViews: boolean;
    haveLengthMeasurements: boolean;
    haveAreaMeasureElements:boolean;
    haveAngleMeasurements:boolean;
    haveWorldSettings:boolean;
    isFreeControlElements:boolean;
    isFitView:boolean;
    onModelReady:()=>void;
    viewId?: string;

    isVisibleSettings:boolean;
    isVertical:boolean;
    hasCombineModels:boolean;
    setOnModelReady:()=>void;
}