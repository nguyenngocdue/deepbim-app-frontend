import React from 'react'
import ElementToggle from './common/ElementToggle';
import { RxAngle } from "react-icons/rx";

interface AngleMeasurementProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const AngleMeasurements:React.FC<AngleMeasurementProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <RxAngle  /> : <RxAngle  />}
            label={isActive ? "": ""}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Angle Measurements"
         /> 
        </>
    )
}

export default AngleMeasurements
