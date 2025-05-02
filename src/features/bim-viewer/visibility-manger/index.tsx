import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import VisibilityGraphicsTabs from "./component/VisibilityGraphicsTabs";
import { UserManager } from "@/services/UserManager";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";

const VisibilityManager = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const usersettings = {
    ...UserManager.get(),
    view: {
      visibility: UserManager.get()?.view?.visibility || {},
    },
  };

  const hasData = !!usersettings?.view?.visibility;

  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="Graphics Visibility Settings"
      description="Customize visibility, color, and transparency by category."
      disableOutsideClose
      className="max-w-5xl"
      // footer={
      //   hasData && (
      //     <>
      //       <Button variant="outline" onClick={onClose}>
      //         Cancel
      //       </Button>
      //       <Button className="bg-blue-600 text-white hover:bg-blue-700">
      //         Apply
      //       </Button>
      //     </>
      //   )
      // }
    >
      {hasData ? (
        <div className="h-[500px] overflow-auto">
          <VisibilityGraphicsTabs 
            dataSource={usersettings} 
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
