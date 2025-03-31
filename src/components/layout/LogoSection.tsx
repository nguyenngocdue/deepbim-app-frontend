import React from 'react'
import { FaCubes } from 'react-icons/fa'

const LogoSection: React.FC = () => {
    return (
        <div className="flex items-center justify-between text-purple-500 text-xl font-bold gap-2">
            <div className="flex items-center gap-2">
                <FaCubes />
                <span className="hidden sm:inline">DeepBIM</span>
                <span className="text-xs text-gray-400 hidden md:inline">Powered by Nissan</span>
            </div>
        </div>
    )
}

export default LogoSection
