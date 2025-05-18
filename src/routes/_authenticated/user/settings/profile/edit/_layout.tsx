import { SidebarProvider } from '@/components/ui/sidebar'
import { SearchProvider } from '@/context/search-context'
import Settings from '@/features/settings'
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
