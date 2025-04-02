import React from 'react'
import ElementToggle from './common/ElementToggle';
import { PiCubeFocusFill } from "react-icons/pi";

interface VolumeMeasurementProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const VolumeMeasurement:React.FC<VolumeMeasurementProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <PiCubeFocusFill  /> : <PiCubeFocusFill  />}
            label={isActive ? "": ""}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Volume Measurement"
         /> 
        </>
    )
}

export default VolumeMeasurement
