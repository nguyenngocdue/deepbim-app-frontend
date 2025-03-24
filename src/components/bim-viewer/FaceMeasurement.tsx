import React from 'react'
import ElementToggle from './common/ElementToggle';
import { RxDimensions } from "react-icons/rx";

interface ClippingEdgesProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const FaceMeasurement:React.FC<ClippingEdgesProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <RxDimensions  /> : <RxDimensions  />}
            label={isActive ? "FaceMeasurement": "FaceMeasurement"}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="FaceMeasurement"
         /> 
        </>
    )
}

export default FaceMeasurement
