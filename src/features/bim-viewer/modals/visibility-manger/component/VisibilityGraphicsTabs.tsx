// src/components/VisibilityGraphicsTabs.tsx
import { useEffect, useState } from "react";
import { DynamicTable } from "./DynamicTable";
import { ColorPickerModal } from "./ColorPickerModal";
import { TransparencyModal } from "./TransparencyModal";
import { defaultCategories, defaultPresetColors } from "./defaults";
import { Input } from "@/components/ui/input";
import ModelTabsTemplate from "@/components/bim-viewer/common/ModelTabsTemplate";


interface VisibilityGraphicsTabsProps {
  hasInit: boolean,
  categories: string[];
  presetColors?: string[];
  checkedCategories: string[];
  setCheckedCategories: (val: string[]) => void;
  categoryColors: Record<string, string>;
  setCategoryColors: (val: Record<string, string>) => void;
  categoryTransparencies: Record<string, number>;
  setCategoryTransparencies: (val: Record<string, number>) => void;
  onClose: (value: boolean) => void;
}

export default function VisibilityGraphicsTabs({
  hasInit = true,
  categories = defaultCategories,
  presetColors = defaultPresetColors,
  checkedCategories,
  setCheckedCategories,
  categoryColors,
  setCategoryColors,
  categoryTransparencies,
  setCategoryTransparencies,
}: VisibilityGraphicsTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTransparencyCategory, setActiveTransparencyCategory] = useState<string | null>(null);
  const [tempColor, setTempColor] = useState<string>("#ffffff");
  const [tempTransparency, setTempTransparency] = useState<number>(0);



  const handleOpenColorPicker = (category: string) => {
    if (!categories.includes(category)) {
      return;
    }
    setActiveCategory(category);
    setTempColor(categoryColors[category] || "#ffffff");
  };

  const handleOpenTransparencyPicker = (category: string) => {
    if (!categories.includes(category)) {
      return;
    }
    setActiveTransparencyCategory(category);
    setTempTransparency(categoryTransparencies[category] || 0);
  };

  const handleColorConfirm = () => {
    if (activeCategory) {
      setCategoryColors({
        ...categoryColors,
        [activeCategory]: tempColor,
      });
    }
    setActiveCategory(null);
  };

  const handleTransparencyConfirm = () => {
    if (activeTransparencyCategory) {
      setCategoryTransparencies({
        ...categoryTransparencies,
        [activeTransparencyCategory]: tempTransparency,
      });
    }
    setActiveTransparencyCategory(null);
  };


  const handleCheckboxChange = (category: string, checked: boolean) => {
    setCheckedCategories(
      checked ? [...checkedCategories, category] : checkedCategories.filter((c) => c !== category)
    );
  };


  const handleResetRow = (category: string) => {
    setCategoryColors({
      ...categoryColors,
      [category]: "",
    });
    setCategoryTransparencies({
      ...categoryTransparencies,
      [category]: NaN,
    });
  };


  const handleCheckAll = (checked: boolean) => {
    setCheckedCategories(checked ? [...categories] : []);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const tabs = [
    {
      label: "Category",
      value: "model",
      content: (
        <>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <DynamicTable
            hasInit={hasInit}
            categories={filteredCategories}
            categoryColors={categoryColors}
            categoryTransparencies={categoryTransparencies}
            checkedCategories={checkedCategories}
            onOpenColorPicker={handleOpenColorPicker}
            onOpenTransparencyPicker={handleOpenTransparencyPicker}
            onCheckboxChange={handleCheckboxChange}
            resetRow={handleResetRow}
            onCheckAllChange={handleCheckAll}
          />
        </>
      ),
    },
    {
      label: "Filter",
      value: "filter",
      content: (
        <p className="text-slate-300">
          Filter tab coming soon... Stay tuned for some BIM magic! 😎
        </p>
      ),
    },
  ];


  return (
    <div className="flex flex-col p-2">
      <ModelTabsTemplate tabs={tabs} contentHeight=""/>
      {activeCategory && (
        <ColorPickerModal
          category={activeCategory}
          tempColor={tempColor}
          presetColors={presetColors}
          initialColor={categoryColors[activeCategory] || "#ffffff"}
          onColorChange={setTempColor}
          onConfirm={handleColorConfirm}
          onCancel={() => setActiveCategory(null)}
        />
      )}

      {activeTransparencyCategory && (
        <TransparencyModal
          category={activeTransparencyCategory}
          tempTransparency={tempTransparency}
          initialTransparency={categoryTransparencies[activeTransparencyCategory] || 0}
          onTransparencyChange={setTempTransparency}
          onConfirm={handleTransparencyConfirm}
          onCancel={() => setActiveTransparencyCategory(null)}
        />
      )}
    </div>
  );
}