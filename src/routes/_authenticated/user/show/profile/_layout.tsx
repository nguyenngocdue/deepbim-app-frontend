import { SidebarProvider } from '@/components/ui/sidebar'
import UserPresentation from '@/features/settings/UserPresentation'
import { createFileRoute } from '@tanstack/react-router'
import Cookies from 'js-cookie'


const defaultOpen = Cookies.get('sidebar_state') !== 'false'

export const Route = createFileRoute('/_authenticated/user/show/profile/_layout')({
   component: () => (
        <SidebarProvider defaultOpen={defaultOpen}>
          <UserPresentation/>
        </SidebarProvider>
   )
})
