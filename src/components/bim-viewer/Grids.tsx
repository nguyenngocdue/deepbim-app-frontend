import React from 'react'
import ElementToggle from './common/ElementToggle';
import { MdOutlineGrid4X4 } from "react-icons/md";

interface GridProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const Grids:React.FC<GridProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <MdOutlineGrid4X4  /> : <MdOutlineGrid4X4  />}
            label={isActive ? "": ""}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Grids"
         /> 
        </>
    )
}

export default Grids
