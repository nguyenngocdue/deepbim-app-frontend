import React from 'react'
import ElementToggle from './common/ElementToggle';
import { TbPerspective } from "react-icons/tb";
import { GiPerspectiveDiceSixFacesTwo } from "react-icons/gi";

interface CameraSettingProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
}

const CameraSetting: React.FC<CameraSettingProps> = ({ onToggle, isActive }) => {
    return (
        <>
            <ElementToggle
                onToggle={onToggle}
                isActive={isActive}
                icon={isActive ? <GiPerspectiveDiceSixFacesTwo /> : <TbPerspective />}
                label={isActive ? "O" : "P"}
                activeColor="bg-gray-800 text-white bg-blue-400"
                inactiveColor=""
                className=""
                hoverTitle="CameraSetting"
            />
        </>
    )
}

export default CameraSetting
