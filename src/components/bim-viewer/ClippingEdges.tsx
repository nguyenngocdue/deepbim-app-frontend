import React from 'react'
import ElementToggle from './common/ElementToggle';
import { GiCardboardBoxClosed } from "react-icons/gi";

interface ClippingEdgesProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
  }

const ClippingEdges:React.FC<ClippingEdgesProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <GiCardboardBoxClosed /> : <GiCardboardBoxClosed />}
            label={isActive ? "Clipping Edges": "Clipping Edges"}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Clipping Edges Elements"
         /> 
        </>
    )
}

export default ClippingEdges
