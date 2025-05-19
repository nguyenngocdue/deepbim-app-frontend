import { SidebarProvider } from '@/components/ui/sidebar'
import UserPresentation from '@/features/settings/UserPresentation'
import { createRootRoute } from '@tanstack/react-router'
import Cookies from 'js-cookie'


const defaultOpen = Cookies.get('sidebar_state') !== 'false'

export const Route = createRootRoute({
   component: () => (
        <SidebarProvider defaultOpen={defaultOpen}>
          <UserPresentation/>
        </SidebarProvider>
   )
})
