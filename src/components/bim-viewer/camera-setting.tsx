import { Button } from "@/components/ui/button";
import { useViewCube } from "@/context/view-cube-context2";
import { MdOutlineSwitchCamera } from "react-icons/md"; 

const CameraSetting: React.FC = () => {
  const { toggleCameraMode, isPerspective } = useViewCube();

  return (
    <Button onClick={() => { toggleCameraMode(); }} title="Toggle Perspective/Ortho">
      <MdOutlineSwitchCamera className="text-lg" />
      <span className="ml-1">{isPerspective ? "Perspective" : "Ortho"}</span>
    </Button>
  );
};

export default CameraSetting;
