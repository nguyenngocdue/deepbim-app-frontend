import React from 'react'
import ElementToggle from './common/ElementToggle';
import { MdDraw } from "react-icons/md";

interface LengthMeasurementProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
}

const LengthMeasurements: React.FC<LengthMeasurementProps> = ({ onToggle, isActive }) => {
    return (
        <>
            <ElementToggle
                onToggle={onToggle}
                isActive={isActive}
                icon={isActive ? <MdDraw /> : <MdDraw />}
                label={isActive ? "LengthMeasurement" : "LengthMeasurement"}
                activeColor="bg-gray-800 text-white bg-blue-400"
                inactiveColor=""
                className=""
                hoverTitle="LengthMeasurement"
            />
        </>
    )
}

export default LengthMeasurements
