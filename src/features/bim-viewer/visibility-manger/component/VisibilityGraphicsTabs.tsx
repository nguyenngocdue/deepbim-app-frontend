// src/components/VisibilityGraphicsTabs.tsx
import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DynamicTable } from "./DynamicTable";
import { ColorPickerModal } from "./ColorPickerModal";
import { TransparencyModal } from "./TransparencyModal";
import { defaultCategories, defaultPresetColors } from "./defaults";
import { mergeCategorySettings } from "@/utils/tables/merge-category-settings";
import { UserManager, UserSetting } from "@/services/UserManager";

interface DataSource {
  view: {
    visibility: any; // Replace 'any' with the actual type if known
  };
}

interface VisibilityGraphicsTabsProps {
  dataSource: DataSource;
  categories?: string[];
  presetColors?: string[];
  onClose: (value: boolean) => void;
}

export default function VisibilityGraphicsTabs({
  dataSource,
  onClose,
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
  const [checkedCategories, setCheckedCategories] = useState<string[]>(categories);

  const configs = dataSource.view?.visibility;
  
  useEffect(() => {
    if(!configs) return;
    setCheckedCategories( categories.filter((category) => configs[category]?.isShow));
  
    setCategoryColors(
      categories.reduce((acc, cat) => {
        if (configs[cat]) {
          acc[cat] = configs[cat].color;
        }
        return acc;
      }, {} as Record<string, string>)
    );
    setCategoryTransparencies(
      categories.reduce((acc, cat) => {
        if (configs[cat]) {
          acc[cat] = Number(configs[cat].transparency);
        }
        return acc;
      }, {} as Record<string, number>)
    );
    

  }, [configs])



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
      setCategoryColors((prev) => ({
        ...prev,
        [activeCategory]: categoryColors[activeCategory] || tempColor,
      }));
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
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const handleFooterCancel = () => {
    setCategoryColors(initialColors);
    setCategoryTransparencies(initialTransparencies);
    setCheckedCategories([]);
    setActiveCategory(null);
    setActiveTransparencyCategory(null);
    onClose(false);
  };

  const handleFooterApply = async () => {
    setCheckedCategories(checkedCategories);
    setInitialColors(categoryColors);
    setInitialTransparencies(categoryTransparencies);
    const settings: Partial<UserSetting> = {
      view: {
        visibility: mergeCategorySettings(
          checkedCategories,
          categoryColors,
          categoryTransparencies
        ),
      },
    };
    // fetch api usersettings
    await UserManager.set(settings);
    onClose(false);
  };

  const handleResetRow = (category: string) => {
    setCategoryColors((prev) => ({
      ...prev,
      [category]: initialColors[category],
    }));
    setCategoryTransparencies((prev) => ({
      ...prev,
      [category]: initialTransparencies[category],
    }));
  };



const handleCheckAll = (checked: boolean) => {
  setCheckedCategories(checked ? [...categories] : []);
};


  const tabs = [
    {
      name: "Model Categories",
      value: "model",
      content: (
        <DynamicTable
          configs={configs}
          categories={categories}
          categoryColors={categoryColors}
          categoryTransparencies={categoryTransparencies}
          checkedCategories={checkedCategories}
          onOpenColorPicker={handleOpenColorPicker}
          onOpenTransparencyPicker={handleOpenTransparencyPicker}
          onCheckboxChange={handleCheckboxChange}
          resetRow={handleResetRow}
          onCheckAllChange={handleCheckAll} 
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
    <div className="bg-slate-950 flex flex-col p-2">
      <Tabs defaultValue="model" className="w-full flex-grow ">
        <div className="w-full  border-b border-zinc-700 pb-2">
          <TabsList className="flex gap-3 bg-transparent justify-start p-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-5 py-2 text-sm font-medium text-slate-300 data-[state=active]:bg-blue-600  data-[state=active]:text-white rounded-lg transition-all hover:text-white"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="">{tab.content}</div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          className="text-slate-300 border-slate-600 hover:bg-slate-800 bg-button-1"
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