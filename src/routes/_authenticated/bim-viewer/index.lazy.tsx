import { createLazyFileRoute } from '@tanstack/react-router'
import BimViewerLayout from '@/pages/bim-viewer/BimViewerLayout'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'

export const Route = createLazyFileRoute('/_authenticated/bim-viewer/')({
  component: () => (
    <ProvidersWrapper>
      <BimViewerLayout />
    </ProvidersWrapper>
  ),
})

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
    </SearchProvider>
  )
}
