import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import VisibilityGraphicsTabs from "./component/VisibilityGraphicsTabs";
import { UserManager, UserSetting } from "@/services/UserManager";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { useEffect, useState } from "react";
import { defaultCategories } from "./component/defaults";
import { mergeCategorySettings } from "@/utils/tables/merge-category-settings";
import AppButton from "@/components/bim-viewer/common/AppButton";



interface VisibilityManagerProps {
  open: boolean;
  onClose: () => void;
}

const VisibilityManager = ({ open, onClose }: VisibilityManagerProps) => {
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [categoryTransparencies, setCategoryTransparencies] = useState<Record<string, number>>({});
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);

  const usersettings = {
    ...UserManager.get(),
    view: {
      visibility: UserManager.get()?.view?.visibility || {},
    },
  };

  const configs = usersettings?.view?.visibility;
  const hasData = !!configs;
  
  useEffect(() => {
    if (!hasData) return;
    setCheckedCategories(
      defaultCategories.filter((category) => configs[category]?.isShow)
    );
    setCategoryColors(
      defaultCategories.reduce((acc, cat) => {
        if (configs[cat]) acc[cat] = configs[cat].color;
        return acc;
      }, {} as Record<string, string>)
    );
    setCategoryTransparencies(
      defaultCategories.reduce((acc, cat) => {
        if (configs[cat]) acc[cat] = configs[cat].transparency;
        return acc;
      }, {} as Record<string, number>)
    );
  }, [hasData]);


  const handleApply = async () => {
    const settings: Partial<UserSetting> = {
      view: {
        visibility: mergeCategorySettings(
          checkedCategories,
          categoryColors,
          categoryTransparencies
        ),
      },
    };
    await UserManager.set(settings);
    onClose();
  };
  
  const handleCancel = () => {
    onClose();
  };


  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="Graphics Visibility Settings"
      description="Customize visibility, color, and transparency by category."
      disableOutsideClose
      className="max-w-5xl"
      footer={
         (
          <>
            <AppButton
              falseName ="Cancel"
              className="bg-blue-600"
              onClick={handleCancel}
              />
            <AppButton
            falseName="Apply"
            trueName="Apply ..."
            className="bg-purple-400 "
            onClick={handleApply}/>
          </>
        )
      }
    >
      {hasData ? (
        <div className="h-[500px] overflow-auto">
          <VisibilityGraphicsTabs 
            categories={defaultCategories}
            categoryColors={categoryColors}
            categoryTransparencies={categoryTransparencies}
            checkedCategories={checkedCategories}
            setCategoryColors={setCategoryColors}
            setCategoryTransparencies={setCategoryTransparencies}
            setCheckedCategories={setCheckedCategories}
            onClose={onClose}
            />
        </div>
      ) : (
        <Alert variant="destructive">
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>
            No settings were found for the selected model.
          </AlertDescription>
        </Alert>
      )}
    </DialogTemplate>
  );
};

export default VisibilityManager;
