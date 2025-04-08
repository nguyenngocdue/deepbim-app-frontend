import React from 'react'
import ElementToggle from './common/ElementToggle';
import { LuCone } from "react-icons/lu";

interface WorldSettingProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const Isolation:React.FC<WorldSettingProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <LuCone  /> : <LuCone  />}
            label={isActive ? "": ""}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Isolation"
         /> 
        </>
    )
}

export default Isolation
