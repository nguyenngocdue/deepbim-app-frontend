import React from 'react'
import ElementToggle from './common/ElementToggle'
import { IoFlashlightSharp  } from "react-icons/io5";

interface HighlightElementPros {
  onToggle: () => void; // Callback function to toggle the Section Box
  isActive: boolean;    // Current state of the Section Box
}

const HighlightElement: React.FC<HighlightElementPros> = (
  {onToggle, isActive}
) => {
  return (
    <>
     <ElementToggle
        onToggle={onToggle}
        isActive={isActive}
        icon={isActive ? <IoFlashlightSharp/> : <IoFlashlightSharp/>}
        label={isActive ? "Highlight": "Highlight"}
        activeColor="bg-gray-800 text-white bg-blue-400"
        inactiveColor=""
        className=""
        hoverTitle="Highlight Elements"
     /> 
    </>
  )
}

export default HighlightElement
