import React from 'react'
import ElementToggle from './common/ElementToggle';
import { VscCombine } from 'react-icons/vsc';

interface CombineModelBtnProps {
    onToggle: () => void; 
    isActive: boolean;    
}

const CombineModelBtn: React.FC<CombineModelBtnProps> = ({ onToggle, isActive }) => {
    return (
        <>
            <ElementToggle
                onToggle={onToggle}
                isActive={isActive}
                icon={isActive ? <VscCombine /> : <VscCombine />}
                label={isActive ? "" : ""}
                activeColor="bg-gray-800 text-white bg-blue-400"
                unActiveColor=""
                className=""
                hoverTitle="Combine model"
                showActiveColor={true}
            />
        </>
    )
}

export default CombineModelBtn
