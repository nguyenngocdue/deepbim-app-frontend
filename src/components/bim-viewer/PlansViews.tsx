import React from 'react'
import ElementToggle from './common/ElementToggle';
import { GiFloorHatch } from "react-icons/gi";

interface VolumeMeasurementProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
}

const PlansViews: React.FC<VolumeMeasurementProps> = ({ onToggle, isActive }) => {
    return (
        <>
            <ElementToggle
                onToggle={onToggle}
                isActive={isActive}
                icon={isActive ? <GiFloorHatch /> : <GiFloorHatch />}
                label={isActive ? "PlansViews" : "PlansViews"}
                activeColor="bg-gray-800 text-white bg-blue-400"
                inactiveColor=""
                className=""
                hoverTitle="PlansViews"
            />
        </>
    )
}

export default PlansViews
