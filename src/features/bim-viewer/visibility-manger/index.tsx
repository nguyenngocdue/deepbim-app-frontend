import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VisibilityGraphicsTabs from "./component/VisibilityGraphicsTabs";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const VisibilityManager = ({ open, onClose }: Props) => {

  const [modelColors, setModelColors] = useState<Record<string, string>>({});

  const handleColorChange = (colors: Record<string, string>) => {
    setModelColors(colors);
    // Cập nhật màu trong 3D viewer
    console.log("Updated colors:", colors);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
            <VisibilityGraphicsTabs
              // categories={["IfcWall", "IfcBeam", "IfcRoof"]}
              onColorChange={handleColorChange}
              onClose={onClose}
            />
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VisibilityManager
