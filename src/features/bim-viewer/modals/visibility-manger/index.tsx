import VisibilityGraphicsTabs from "./component/VisibilityGraphicsTabs";
import { UserManager, UserSetting } from "@/services/UserManager";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { useEffect, useState } from "react";
import { defaultCategories } from "./component/defaults";
import { mergeCategorySettings } from "@/utils/tables/merge-category-settings";
import AppButton from "@/components/bim-viewer/common/AppButton";
import { fragmentManager } from "@/services/FragmentManager";
import { updateUserSettings } from "../../visibility-settings/ModelSetting";


interface VisibilityManagerProps {
  open: boolean;
  onClose: () => void;
}

const VisibilityManager = ({ open, onClose }: VisibilityManagerProps) => {
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [categoryTransparencies, setCategoryTransparencies] = useState<Record<string, number>>({});
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const params = new URLSearchParams(window.location.search);
  const viewId = params.get("v");

  const usersettings = {
    ...UserManager.get(),
    view: {
      visibility: UserManager.get()?.view?.visibility || {},
    },
  };

  const configs = usersettings?.view?.visibility[viewId];
  const hasData = !!configs; //include In the case when user open the model for the first time

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


  const handleSettings = async (isInit: boolean) => {
    const settings: Partial<UserSetting> = {
      view: {
        visibility: {
          [viewId || "defaultViewId"]: mergeCategorySettings(
            isInit,
            defaultCategories,
            checkedCategories,
            categoryColors,
            categoryTransparencies
          )
        }
      },
    };
    await UserManager.set(settings);
    const selectedModel = fragmentManager.getModelByObjectName('example');
    const configs = settings.view?.visibility;
    updateUserSettings({ selectedModel, configs });
  }
  if (!configs) {
    handleSettings(true);
  }

  const handleApply = async () => {
    handleSettings(false);
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
              falseName="Cancel"
              className="bg-blue-600"
              onClick={handleCancel}
            />
            <AppButton
              falseName="Apply"
              trueName="Apply ..."
              className="bg-purple-400 "
              onClick={handleApply} />
          </>
        )
      }
    >

      <div className=" overflow-auto">
        <VisibilityGraphicsTabs
          hasInit={!hasData}
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
    </DialogTemplate>
  );
};

export default VisibilityManager;
