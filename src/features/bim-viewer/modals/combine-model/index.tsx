import React from 'react'
import { DialogTemplate } from '@/components/model-table/DialogTemplate';
import CombineModels from './components/CombineModels';

interface CombineModelManagerProps {
  open: boolean;
  onClose: () => void;
}

const CombineModelManager: React.FC<CombineModelManagerProps> = () => {
  return (
        <div className=''>
          <CombineModels onAddModelClick={() => console.log('Add Model Clicked')} />
        </div>
  )
}

export default CombineModelManager;
