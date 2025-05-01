import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { X } from "lucide-react";

interface TransparencyModalProps {
  category: string;
  tempTransparency: number;
  initialTransparency: number;
  onTransparencyChange: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransparencyModal({
  category,
  tempTransparency,
  initialTransparency,
  onTransparencyChange,
  onConfirm,
  onCancel,
}: TransparencyModalProps) {
  const handleCancel = () => {
    onTransparencyChange(initialTransparency);
    onCancel();
    toast.info(`Canceled transparency selection for "${category}"`, {
      style: { background: "#1E293B", color: "#F1F5F9" },
    });
  };

  const handleConfirm = () => {
    onConfirm();
    onCancel();
    toast.success(`Transparency set to ${tempTransparency}% for "${category}"`, {
      style: { background: "#1E293B", color: "#F1F5F9" },
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-slate-900 rounded-xl shadow-2xl w-[400px] p-6 space-y-6 border border-slate-700 animate-in fade-in-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-100">
            Set Transparency for {category}
          </h2>
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-slate-300 font-medium">
              Transparency: {tempTransparency}%
            </span>
          </div>
          <Slider
            value={[tempTransparency]}
            onValueChange={(value) => onTransparencyChange(value[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
            aria-label={`Adjust transparency for ${category}`}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="text-slate-300 border-slate-600 hover:bg-slate-800"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleConfirm}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}