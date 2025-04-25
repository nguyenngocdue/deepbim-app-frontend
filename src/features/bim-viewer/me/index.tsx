import React from 'react'
import ModelTable from './components/ModelTable';
import Upload from '@/components/Upload';

const UserProjectsPage: React.FC = () => {
  return (
    <>
            <Upload/>
            <ModelTable />
    </>
  )
}

export default UserProjectsPage;
