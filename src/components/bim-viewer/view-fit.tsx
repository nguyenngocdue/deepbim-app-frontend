import { HiViewfinderCircle } from "react-icons/hi2";
import React from 'react'
import ElementToggle from './common/ElementToggle';

interface ViewFitProps {
    onToggle: () => void; 
    isActive: boolean;    
}

const ViewFit: React.FC<ViewFitProps> = ({ onToggle, isActive }) => {
    return (
        <>
            <ElementToggle
                onToggle={onToggle}
                isActive={isActive}
                icon={isActive ? <HiViewfinderCircle /> : <HiViewfinderCircle />}
                label={isActive ? "" : ""}
                activeColor="bg-gray-800 text-white bg-blue-400"
                inactiveColor=""
                className=""
                hoverTitle="ViewFit"
            />
        </>
    )
}

export default ViewFit

