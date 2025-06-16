import { SidebarProvider } from '@/components/ui/sidebar'
import Settings from '@/features/settings/Settings'
import { createRootRoute, createFileRoute } from '@tanstack/react-router'
import Cookies from 'js-cookie'


const defaultOpen = Cookies.get('sidebar_state') !== 'false'

export const Route = createRootRoute('/_authenticated/user/settings/profile/edit/_layout')({
   component: () => (
        <SidebarProvider defaultOpen={defaultOpen}>
          <Settings/>
        </SidebarProvider>
   )
})
