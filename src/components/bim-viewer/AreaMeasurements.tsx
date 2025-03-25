import React from 'react'
import ElementToggle from './common/ElementToggle';
import { RxBorderNone } from "react-icons/rx";

interface AreaMeasurementProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const AreaMeasurements:React.FC<AreaMeasurementProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <RxBorderNone  /> : <RxBorderNone  />}
            label={isActive ? "AreaMeasurement": "AreaMeasurement"}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="AreaMeasurement"
         /> 
        </>
    )
}

export default AreaMeasurements
