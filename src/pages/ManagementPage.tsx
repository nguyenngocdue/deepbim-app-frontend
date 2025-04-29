import SidebarLayout from '@/components/layout/SidebarLayout'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/theme-context'
import { Outlet } from '@tanstack/react-router'
import React from 'react'

const ManagementPage: React.FC = () => {
    return (
        <LanguageProvider>
            <ThemeProvider>
                <SidebarLayout>
                    <Outlet /> 
                </SidebarLayout>
            </ThemeProvider>
        </LanguageProvider>
    )
}



export default ManagementPage

