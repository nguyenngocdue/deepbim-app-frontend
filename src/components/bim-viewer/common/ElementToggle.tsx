import React from "react";
import { Button } from "@/components/ui/button";

interface ElementToggleProps {
    onToggle: () => void; // Callback function to toggle the element
    isActive: boolean;    // Current state of the element
    icon?: React.ReactNode; // Optional custom icon
    label?: string;        // Optional label text
    activeColor?: string;  // Custom color when active
    inactiveColor?: string; // Custom color when inactive
    className?: string;    // Additional custom class names
    hoverTitle?: string;   // Optional hover title
}

const ElementToggle: React.FC<ElementToggleProps> = ({
    onToggle,
    isActive,
    icon = null,
    label = "Toggle",
    activeColor = "bg-green-500",
    inactiveColor = "bg-blue-500",
    className = "",
    hoverTitle = "Toggle Element",
}) => {
    return (
        <Button
            title={hoverTitle} // Use hoverTitle for the tooltip
            onClick={() => {
                // Call the onToggle function to update the state
                onToggle();
            }}
            className={`hover:${inactiveColor} ${isActive ? activeColor : inactiveColor} ${className}`}
        >
            {icon && <div className="text-lg">{icon}</div>}
            <span className="ml-1">{label}</span>
        </Button>
    );
};

export default ElementToggle;