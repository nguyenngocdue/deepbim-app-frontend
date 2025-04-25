import React from 'react'
import ModelTable from './components/ModelTable';
import BreadcrumbsWithIconAndLabel from './components/BreadcrumbsWithIconAndLabel';
import SidebarLayout from '@/components/layout/SidebarLayout';

const ProjectManangementByMe: React.FC = () => {
  return (
    <>
      <SidebarLayout>
        <BreadcrumbsWithIconAndLabel />
        <ModelTable />
      </SidebarLayout>
    </>
  )
}

export default ProjectManangementByMe;
