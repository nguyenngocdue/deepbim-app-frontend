// src/components/ColorPickerModal.tsx
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HexColorPicker } from "react-colorful";
import { X } from "lucide-react";

interface ColorPickerModalProps {
  category: string;
  tempColor: string;
  presetColors: string[];
  initialColor: string;
  onColorChange: (color: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ColorPickerModal({
  category,
  tempColor,
  presetColors,
  initialColor,
  onColorChange,
  onConfirm,
  onCancel,
}: ColorPickerModalProps) {
  const handleCancel = () => {
    onColorChange(initialColor || "#ffffff");
    onCancel();
    toast.info(`Canceled color selection for "${category}"`, {
      style: { background: "#1E293B", color: "#F1F5F9" },
    });
  };

  const handleConfirm = () => {
    onConfirm();
    onCancel(); // Đóng modal sau khi confirm
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Ngăn sự kiện click lan truyền
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
            Select Color for {category}
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
            <div
              className="w-16 h-16 rounded-lg border border-slate-600"
              style={{ backgroundColor: tempColor }}
            />
            <span className="text-slate-300 font-medium">{tempColor}</span>
          </div>
          <HexColorPicker
            color={tempColor}
            onChange={onColorChange}
            style={{ width: "100%", borderRadius: 8 }}
          />
          <div className="grid grid-cols-8 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-md border border-slate-600 hover:scale-110 transition-transform duration-150"
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
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