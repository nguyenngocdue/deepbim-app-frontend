import { Button } from "@/components/ui/button";
import { GiIceCube } from "react-icons/gi";

const SectionBox: React.FC = () => {

  return (
    <Button title="Toggle Perspective/Ortho">
      <GiIceCube  className="text-lg" />
      <span className="ml-1">Section Box</span>
    </Button>
  );
};

export default SectionBox;
