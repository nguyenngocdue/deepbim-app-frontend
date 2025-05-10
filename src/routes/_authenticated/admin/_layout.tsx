import SidebarAdminLayout from '@/components/layout/SidebarAdminLayout'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/theme-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <LanguageProvider>
      <ThemeProvider>
        <SidebarAdminLayout>
          <Outlet />
        </SidebarAdminLayout>
      </ThemeProvider>
    </LanguageProvider>
  </>
}
