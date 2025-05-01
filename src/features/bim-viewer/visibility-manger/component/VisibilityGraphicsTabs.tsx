// src/components/VisibilityGraphicsTabs.tsx
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DynamicTable } from "./DynamicTable";
import { ColorPickerModal } from "./ColorPickerModal";
import { TransparencyModal } from "./TransparencyModal";
import { defaultCategories, defaultPresetColors } from "./defaults";

interface VisibilityGraphicsTabsProps {
  categories?: string[];
  presetColors?: string[];
}

export default function VisibilityGraphicsTabs({
  categories = defaultCategories,
  presetColors = defaultPresetColors,
}: VisibilityGraphicsTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTransparencyCategory, setActiveTransparencyCategory] = useState<string | null>(null);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [categoryTransparencies, setCategoryTransparencies] = useState<Record<string, number>>({});
  const [initialColors, setInitialColors] = useState<Record<string, string>>({});
  const [initialTransparencies, setInitialTransparencies] = useState<Record<string, number>>({});
  const [tempColor, setTempColor] = useState<string>("#ffffff");
  const [tempTransparency, setTempTransparency] = useState<number>(0);
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);

  const handleOpenColorPicker = (category: string) => {
    if (!categories.includes(category)) {
      toast.error("Invalid category selected!", {
        style: { background: "#1E293B", color: "#F1F5F9" },
      });
      return;
    }
    setActiveCategory(category);
    setTempColor(categoryColors[category] || "#ffffff");
  };

  const handleOpenTransparencyPicker = (category: string) => {
    if (!categories.includes(category)) {
      toast.error("Invalid category selected!", {
        style: { background: "#1E293B", color: "#F1F5F9" },
      });
      return;
    }
    setActiveTransparencyCategory(category);
    setTempTransparency(categoryTransparencies[category] || 0);
  };

  const handleColorConfirm = () => {
    if (activeCategory) {
      setCategoryColors((prev) => ({
        ...prev,
        [activeCategory]: tempColor,
      }));
      toast.success(`Color set for "${activeCategory}"`, {
        style: { background: "#1E293B", color: "#F1F5F9" },
      });
    }
  };

  const handleTransparencyConfirm = () => {
    if (activeTransparencyCategory) {
      setCategoryTransparencies((prev) => ({
        ...prev,
        [activeTransparencyCategory]: tempTransparency,
      }));
    }
  };

  const handleCancelModal = () => {
    setActiveCategory(null);
  };

  const handleCancelTransparencyModal = () => {
    setActiveTransparencyCategory(null);
  };

  const handleCheckboxChange = (category: string, checked: boolean) => {
    setCheckedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((cat) => cat !== category)
    );
  };

  const handleFooterCancel = () => {
    setCategoryColors(initialColors);
    setCategoryTransparencies(initialTransparencies);
    setCheckedCategories([]);
    setActiveCategory(null);
    setActiveTransparencyCategory(null);
    toast.info("All changes have been canceled!", {
      style: { background: "#1E293B", color: "#F1F5F9" },
    });
  };

  const handleFooterApply = () => {
    setInitialColors(categoryColors);
    setInitialTransparencies(categoryTransparencies);
    toast.success(
      `All changes applied (${checkedCategories.length} categories selected)!`,
      {
        style: { background: "#1E293B", color: "#F1F5F9" },
      }
    );
  };

  const tabs = [
    {
      name: "Model Categories",
      value: "model",
      content: (
        <DynamicTable
          categories={categories}
          categoryColors={categoryColors}
          categoryTransparencies={categoryTransparencies}
          checkedCategories={checkedCategories}
          onOpenColorPicker={handleOpenColorPicker}
          onOpenTransparencyPicker={handleOpenTransparencyPicker}
          onCheckboxChange={handleCheckboxChange}
        />
      ),
    },
    {
      name: "Filter",
      value: "filter",
      content: (
        <p className="text-slate-300">
          Filter tab coming soon... Stay tuned for some BIM magic! 😎
        </p>
      ),
    },
  ];

  return (
    <div className="bg-slate-950 p-6 flex flex-col">
      <Tabs defaultValue="model" className="w-full flex-grow">
        <div className="w-full bg-slate-900 border-b border-slate-800 px-4 pt-3">
          <TabsList className="flex gap-3 bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-5 py-2 text-sm font-medium text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all hover:text-white"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="p-6">{tab.content}</div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 flex justify-end gap-3">
        <Button
          variant="outline"
          className="text-slate-300 border-slate-600 hover:bg-slate-800"
          onClick={handleFooterCancel}
          aria-label="Cancel all changes"
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleFooterApply}
          aria-label="Apply all changes"
        >
          Apply
        </Button>
      </div>

      {activeCategory && (
        <ColorPickerModal
          category={activeCategory}
          tempColor={tempColor}
          presetColors={presetColors}
          initialColor={categoryColors[activeCategory] || "#ffffff"}
          onColorChange={setTempColor}
          onConfirm={handleColorConfirm}
          onCancel={handleCancelModal}
        />
      )}

      {activeTransparencyCategory && (
        <TransparencyModal
          category={activeTransparencyCategory}
          tempTransparency={tempTransparency}
          initialTransparency={categoryTransparencies[activeTransparencyCategory] || 0}
          onTransparencyChange={setTempTransparency}
          onConfirm={handleTransparencyConfirm}
          onCancel={handleCancelTransparencyModal}
        />
      )}
    </div>
  );
}