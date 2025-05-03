import React, { useState } from 'react'
import CombineModels from './components/CombineModels';
import SelectionModel from './components/SelectionModel';

interface CombineModelManagerProps {
}

const CombineModelManager: React.FC<CombineModelManagerProps> = () => {
  const [openSelectModel, setOpenSelectModel] = useState(false);
  return (
    <>
        <div className=''>
          <CombineModels onAddModelClick={() => setOpenSelectModel(true)} />
        </div>
        {openSelectModel && <SelectionModel open={openSelectModel} onClose={() => setOpenSelectModel(false)}/>}
    </>
  )
}

export default CombineModelManager;
