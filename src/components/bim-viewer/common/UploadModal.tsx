import React, { useState } from "react";
import { useIfcLoader } from "@/features/bim-viewer/useIfcLoader";
import LoadingOverlay from "./LoadingOverlay";
import * as THREE from 'three';
import UploadModel from "../UploadModel";

interface UploadModalProps {
  worldRef: React.RefObject<any>;
  componentRef: React.RefObject<any>;
  modelRef: React.RefObject<THREE.Object3D | null>;
  boxHelperRef: React.RefObject<THREE.BoxHelper | null>;
}

const UploadModal: React.FC<UploadModalProps> = ({
  worldRef,
  componentRef,
  modelRef,
  boxHelperRef,
}) => {
  const [loading, setLoading] = useState(false);

  // Hàm xử lý upload file
  const handleFileUpload = (file: Uint8Array | null) => {
    if (!file) {
      console.error("No file data received");
      return;
    }

    setLoading(true); // Bắt đầu loading

    // Sử dụng useIfcLoader để load model
    useIfcLoader({
      worldRef,
      componentRef,
      modelRef,
      boxHelperRef,
      selectedFile: file,
    }).then(() => {
      setLoading(false); // Dừng loading khi tải xong
    }).catch((error) => {
      console.error("Error loading IFC:", error);
      setLoading(false); // Dừng loading khi có lỗi
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Your 3D Viewer</h2>
        <p className="mb-6">Upload your 3D model or drag & drop files here.</p>

        {/* UploadModel Component */}
        <UploadModel onToggle={handleFileUpload} />

        {/* Loading Overlay */}
        {loading && <LoadingOverlay loading={loading} />}
      </div>
    </div>
  );
};

export default UploadModal;