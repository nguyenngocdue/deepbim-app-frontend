import React from 'react';
import { LuAxis3D } from "react-icons/lu";
import { Button } from '../ui/button';

interface CoordinateSystemProps {
    onToggle: () => void; // Callback function to toggle the Coordinate System
    isActive: boolean;    // Current state of the Coordinate System
}

const CoordinateSystem: React.FC<CoordinateSystemProps> = ({ onToggle, isActive }) => {
    return (
        <Button
            title="Toggle Coordinate System"
            onClick={(e) => {
                // Change the color immediately by toggling classes directly in the DOM
                const button = e.currentTarget;
                button.classList.toggle("bg-green-500"); // Add/remove class
                button.classList.toggle("bg-blue-500"); // Add/remove class

                // Call the onToggle function to update the state
                onToggle();
            }}
            className={`hover:bg-blue-500 ${isActive ? 'bg-green-500' : ''}`}
        >
            <LuAxis3D className="text-lg" />
            <span className="ml-1">CS</span>
        </Button>
    );
};

export default CoordinateSystem;