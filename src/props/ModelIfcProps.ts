export interface ModelIfcProps {
    onToggle:any,
    handleFileSelect:any,
    navigationMode: "Orbit" | "FirstPerson" | "Plan";
    sectionActive: boolean;
    isOrthoPerspective: boolean;
    coordinateSysActive: boolean;
    isHighlightEnabled: boolean;
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
    isOriginalWorldCamera:boolean;
    isFreeControlElements:boolean;
    isPlaneHover:boolean;
    isFitView:boolean;
    onModelReady:()=>void;

    onToggleTheme: () => void;
    currentTheme: "light" | "dark";
    viewId?: string;
}