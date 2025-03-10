import { Button } from "@/components/ui/button";
import { useViewCube } from "@/context/view-cube-context";
import { HiViewfinderCircle } from "react-icons/hi2";


const ViewFit: React.FC= () => {
  const { resetView, setCamera } = useViewCube();
  return (
    <Button onClick={() => { resetView() }}>
      <HiViewfinderCircle className="text-lg" />
    </Button>
  );
};

export default ViewFit;
