import React from 'react'
import ElementToggle from './common/ElementToggle';
import { IoIosSettings } from "react-icons/io";

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
            icon={isActive ? <IoIosSettings  /> : <IoIosSettings  />}
            label={isActive ? "WorldSettings": "WorldSettings"}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="WorldSettings"
         /> 
        </>
    )
}

export default WorldSettings
