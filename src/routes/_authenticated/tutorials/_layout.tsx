import { TutorialSidebar } from '@/features/tutorials/components/TutorialSidebar';
import { createFileRoute, createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="max-h-screen">
        <TutorialSidebar/>
        <div className='mt-24'>
          <Outlet/>    
        </div>
    </div>
  ),
});