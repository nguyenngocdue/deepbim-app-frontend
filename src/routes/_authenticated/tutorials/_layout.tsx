import { TutorialSidebar } from '@/features/tutorials/components/TutorialSidebar';
import { createFileRoute, createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute('/_authenticated/tutorials/_layout')({
  component: () => (
    <div className="max-h-screen">
        <TutorialSidebar/>
        <Outlet/>    
    </div>
  ),
});