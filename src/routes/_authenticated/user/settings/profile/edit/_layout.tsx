import { SidebarProvider } from '@/components/ui/sidebar'
import Settings from '@/features/settings/Settings'
import { createRootRoute } from '@tanstack/react-router'
import Cookies from 'js-cookie'


const defaultOpen = Cookies.get('sidebar_state') !== 'false'

export const Route = createRootRoute({
   component: () => (
        <SidebarProvider defaultOpen={defaultOpen}>
          <Settings/>
        </SidebarProvider>
   )
})
