import React from 'react'
import ElementToggle from './common/ElementToggle';
import { MdOutlineDarkMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";

interface WorldSettingProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const WorldSettings:React.FC<WorldSettingProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <MdOutlineDarkMode  /> : <CiDark  />}
            label={isActive ? "": ""}
            activeColor="bg-gray-800 text-white"
            inactiveColor=""
            className="bg-green-700"
            hoverTitle="WorldSettings"
         /> 
        </>
    )
}

export default WorldSettings
