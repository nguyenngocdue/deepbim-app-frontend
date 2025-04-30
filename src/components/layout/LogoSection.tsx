import React from 'react'
import { LogoWord } from '../LogoWord'

const LogoSection: React.FC = () => {
    return (
        <div className="flex items-center justify-between text-logo-50 text-xl font-bold gap-2">
            <div className="flex items-center gap-2">
                <LogoWord size='sm' path="/images/logo_no_bg.png" />
                <span className="text-xs text-gray-500 hidden md:inline">Powered by Nissan</span>
            </div>
        </div>
    )
}

export default LogoSection
