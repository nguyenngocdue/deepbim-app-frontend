import React from 'react'
import ElementToggle from './common/ElementToggle';
import { MdOutlineControlCamera } from "react-icons/md";

interface PlaneHoverProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const PlaneHover:React.FC<PlaneHoverProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <MdOutlineControlCamera  /> : <MdOutlineControlCamera  />}
            label={isActive ? "FreeControlElementsV2": "FreeControlElementsV2"}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Original World Camera"
         /> 
        </>
    )
}

export default PlaneHover
