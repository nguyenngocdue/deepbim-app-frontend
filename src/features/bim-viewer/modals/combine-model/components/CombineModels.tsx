import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ModelItem {
  id: string;
  name: string;
  thumbnail: string;
}

interface CombineModelsProps {
  onAddModelClick: () => void;
  models?: ModelItem[];
}

export default function CombineModels({
  onAddModelClick,
  models = [],
}: CombineModelsProps) {
  return (
    <div className="w-72 rounded-xl bg-zinc-900 text-white p-4 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
        <h3 className="text-sm font-medium tracking-tight">Combine Models</h3>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-zinc-800 rounded-full"
          onClick={onAddModelClick}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Model List */}
      <div className="space-y-2">
        {models.map((model) => (
          <div
            key={model.id}
            className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <img
              src={model.thumbnail}
              alt={model.name}
              className="w-9 h-9 object-cover rounded-md"
            />
            <span className="text-sm font-medium">{model.name}</span>
          </div>
        ))}
        {models.length === 0 && (
          <div className="text-sm text-zinc-400 italic">No models yet.</div>
        )}
      </div>
    </div>
  );
}
