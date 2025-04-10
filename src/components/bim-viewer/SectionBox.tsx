import { Button } from "@/components/ui/button";
import { GiIceCube } from "react-icons/gi";

interface SectionBoxProps {
    onToggle: () => void; // Callback function to toggle the Section Box
    isActive: boolean;    // Current state of the Section Box
}

const SectionBox: React.FC<SectionBoxProps> = ({ onToggle, isActive }) => {
    return (
        <Button
            title="Toggle Perspective/Ortho"
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
            <GiIceCube className="text-lg" />
            <span className="ml-1">SectionBox</span>
        </Button>
    );
};

export default SectionBox;