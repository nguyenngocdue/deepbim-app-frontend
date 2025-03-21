import { Button } from "@/components/ui/button";
import { GiIceCube } from "react-icons/gi";


interface SectionBoxProps {
  onToggle: () => void; // Hàm callback để toggle Section Box
    isActive: boolean;    // Trạng thái hiện tại của Section Box
}


const SectionBox: React.FC<SectionBoxProps> = ({onToggle, isActive}) => {
  return (
    <Button title="Toggle Perspective/Ortho" onClick={onToggle}
            className={`${isActive ? 'bg-blue-500' : ''}`}>
      <GiIceCube  className="text-lg" />
      <span className="ml-1">SectionBox</span>
    </Button>
  );
};

export default SectionBox;
