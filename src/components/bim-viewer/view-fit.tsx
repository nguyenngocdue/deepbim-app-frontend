import { Button } from "@/components/ui/button";
import { useViewCube } from "@/context/view-cube-context2";
import { HiViewfinderCircle } from "react-icons/hi2";


const ViewFit: React.FC = () => {
  const context = useViewCube();
  
  if (!context) {
    console.error("❌ ViewFit: `useViewCube()` returned null!");
    return null;
  }

  const { resetView } = context;

  return (
    <Button onClick={() => { 
      console.log("🛠 Resetting View...");
      resetView();
    }}>
      <HiViewfinderCircle className="text-lg" />
    </Button>
  );
};


export default ViewFit;
