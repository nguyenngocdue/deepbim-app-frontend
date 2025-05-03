import { useEffect } from "react";
import { useEdgeMeasurement } from "../useEdgeMeasurement";
import { useFaceMeasurement } from "../useFaceMeasurement";
import { useVolumeMeasurement } from "../useVolumeMeasurement";
import { useLengthMeasurements } from "../useLengthMeasurements";
import { useAreaMeasurements } from "../useAreaMeasurements";
import { useAngleMeasurements } from "../useAngleMeasurements";

export function useMeasurementFeatures({
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef,
    featureFlags,
}: any) {
    const {
        isEdgeMeasurement,
        isFaceMeasurement,
        hasVolumeMeasurement,
        haveLengthMeasurements,
        haveAreaMeasureElements,
        haveAngleMeasurements,
    } = featureFlags;

 

    useEffect(() => {
        useEdgeMeasurement({ isEdgeMeasurement, componentRef, worldRef, ifcContainerRef });
        useFaceMeasurement({ isFaceMeasurement, componentRef, worldRef, ifcContainerRef });
        useVolumeMeasurement({ hasVolumeMeasurement, componentRef, worldRef, ifcContainerRef, modelRef });
        useLengthMeasurements({ haveLengthMeasurements, componentRef, worldRef, ifcContainerRef, modelRef });
        useAreaMeasurements({ haveAreaMeasureElements, componentRef, worldRef, ifcContainerRef, modelRef });
        useAngleMeasurements({ haveAngleMeasurements, componentRef, worldRef, ifcContainerRef, modelRef });
    }, [
        isEdgeMeasurement,
        isFaceMeasurement,
        hasVolumeMeasurement,
        haveLengthMeasurements,
        haveAreaMeasureElements,
        haveAngleMeasurements,
    ]);
}
