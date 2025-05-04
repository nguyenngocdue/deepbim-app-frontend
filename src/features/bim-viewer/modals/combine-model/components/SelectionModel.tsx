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
        title="Manage Combined Models"
        description="Select, organize, and combine multiple models into a single scene for unified visualization and analysis."
        disableOutsideClose
      >
        <ModelTabs />
      </DialogTemplate>
    </>
  );
};

export default SelectionModel;




