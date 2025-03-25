import React from 'react'
import ElementToggle from './common/ElementToggle';
import { MdOutlineGpsFixed } from "react-icons/md";

interface OriginalWorldCameraProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const OriginalWorldCamera:React.FC<OriginalWorldCameraProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <MdOutlineGpsFixed  /> : <MdOutlineGpsFixed  />}
            label={isActive ? "OriginalWorldCamera": "OriginalWorldCamera"}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Original World Camera"
         /> 
        </>
    )
}

export default OriginalWorldCamera
