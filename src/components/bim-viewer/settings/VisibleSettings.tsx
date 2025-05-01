import React from 'react'
import ElementToggle from '../common/ElementToggle';
import { TbSettingsSpark } from 'react-icons/tb';

interface AngleMeasurementProps {
    onToggle: () => void;
    isActive: boolean;   
  }

const VisibleSettings:React.FC<AngleMeasurementProps> = ({onToggle, isActive}) => {
    return (
        <>
         <ElementToggle
            onToggle={onToggle}
            isActive={isActive}
            icon={isActive ? <TbSettingsSpark /> : <TbSettingsSpark />}
            label={isActive ? "": ""}
            activeColor="bg-gray-800 text-white bg-blue-400"
            inactiveColor=""
            className=""
            hoverTitle="Visible Settings"
         /> 
        </>
    )
}

export default VisibleSettings
