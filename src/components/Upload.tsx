"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchWithAuth2 } from '@/api';
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";


type UploadProps = {
  onUploadSuccess?: () => void;
  accept?: string;
  maxSizeMB?: number; // ✅ Thêm maxSizeMB
};

const Upload: React.FC<UploadProps> = ({
  onUploadSuccess,
  accept = "*/*",
  maxSizeMB = 500, // ✅ Mặc định 500MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      setMessage("❌ You must be logged in to upload a file.");
      toast.error(`❌You must be logged in to upload a file.`);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Kiểm tra dung lượng trước khi upload
    const fileSizeMB = file.size / (1024 * 1024); // convert bytes -> MB
    if (fileSizeMB > maxSizeMB) {
      setMessage(`❌ File too large. Max allowed: ${maxSizeMB}MB.`);
      toast.error(`❌ File too large. Max allowed: ${maxSizeMB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetchWithAuth2(`${import.meta.env.VITE_API_BASE_URL}/media/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      setMessage("✅ Upload successful!");
      toast.success("✅ Upload successful!");
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      setMessage("Upload error: " + error.message);
      toast.error("Upload error: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2 flex gap-2">
      <Button
        onClick={handleButtonClick}
        disabled={uploading}
        className="bg-green-900 hover:bg-green-800 text-white"
      >
        {uploading ? "Uploading..." : "Upload Model"}
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      {message && (
        <div className="flex gap-2">
          <Separator orientation="vertical" className='h-6 bg-zinc-500  hidden md:block'/>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Upload;
