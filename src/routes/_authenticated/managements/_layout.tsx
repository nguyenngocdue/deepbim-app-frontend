import SidebarLayout from '@/components/layout/SidebarLayout'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/theme-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <LanguageProvider>
      <ThemeProvider>
        <SidebarLayout>
          <Outlet />
        </SidebarLayout>
      </ThemeProvider>
    </LanguageProvider>
  </>
}
