import React, { useState } from 'react';
import Upload from '@/components/Upload';
import MediaPage from './components/MediaPage';

const UserProjectsPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Hàm này sẽ được truyền xuống Upload
  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1); // Tăng key để MediaPage tự fetch lại
  };

  return (
    <div>
      <div className='flex justify-start'>
        <Upload onUploadSuccess={handleUploadSuccess} accept=".ifc"/>
      </div>
      <MediaPage key={refreshKey} />
    </div>
  );
};

export default UserProjectsPage;
