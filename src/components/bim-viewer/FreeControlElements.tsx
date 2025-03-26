import React from 'react'
import ElementToggle from './common/ElementToggle';
import { MdOutlineControlCamera } from "react-icons/md";

interface OriginalWorldCameraProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const FreeControlElements:React.FC<OriginalWorldCameraProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <MdOutlineControlCamera  /> : <MdOutlineControlCamera  />}
            label={isActive ? "FreeControlElements": "FreeControlElements"}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Original World Camera"
         /> 
        </>
    )
}

export default FreeControlElements
