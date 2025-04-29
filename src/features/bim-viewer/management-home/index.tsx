import React, { useState } from 'react';
import MediaPage from './components/MediaPage';
import Upload from '@/components/Upload';

const ManagenentHome: React.FC = () => {
 const [refreshKey, setRefreshKey] = useState(0);

  // Hàm này sẽ được truyền xuống Upload
  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1); // Tăng key để MediaPage tự fetch lại
  };

  return (
    <div>
      {
        import.meta.env.VITE_ENV !== 'production' &&
      <div className='flex justify-start'>
        <Upload onUploadSuccess={handleUploadSuccess} accept=".ifc" />
      </div>
      }
      <MediaPage key={refreshKey} />
    </div>
  );
};

export default ManagenentHome;
