import { DialogTemplate } from '@/components/model-table/DialogTemplate';
import React from 'react'
import ModelTabs from './ModelTabs';

interface SelectionModelProps {
  open: boolean;
  onClose: () => void;
}

const SelectionModel: React.FC<SelectionModelProps> = ({ open, onClose }) => {
 

  return (
    <>
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="Graphics Visibility Settings"
      description="Customize visibility, color, and transparency by category."
      disableOutsideClose
      // className="max-w-5xl  max-h-[650px]"
     
    >
        <ModelTabs />
    </DialogTemplate>
    </>
  );
};

export default SelectionModel;




