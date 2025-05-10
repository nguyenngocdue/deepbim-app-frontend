"use client";

import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchWithAuth2 } from "@/api";
import { toast } from "sonner";
import { UploadProgressModal } from "./common/UploadProgressModal";
import AppButton from "./bim-viewer/common/AppButton";

type UploadProps = {
  onUploadSuccess?: () => void;
  accept?: string;
  maxSizeMB?: number;
};


const Upload: React.FC<UploadProps> = ({
  onUploadSuccess,
  accept = "*/*",
  maxSizeMB = 500,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      setMessage("❌ You must be logged in to upload a file.");
      toast.error("❌ You must be logged in to upload a file.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setMessage(`❌ File too large. Max allowed: ${maxSizeMB}MB.`);
      toast.error(`❌ File too large. Max allowed: ${maxSizeMB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await simulateProgress(0, 40, 1000);

      const response = await fetchWithAuth2(`/media/upload`, {
        method: "POST",
        body: formData,
      });


      if (response.statusCode === 201) {
        toast.success('A file uploaded successfully')
        await simulateProgress(70, 100, 1000);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        toast.error('Failed to upload file')
      }
    } catch (error: any) {
      setMessage("Upload error: " + error.message);
      toast.error("Upload error: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const simulateProgress = (from: number, to: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const startTime = Date.now();
      const endTime = startTime + duration;

      const tick = () => {
        const now = Date.now();
        const progressFraction = Math.min(1, (now - startTime) / duration);
        const currentProgress = from + (to - from) * progressFraction;
        setProgress(currentProgress);

        if (now < endTime) {
          requestAnimationFrame(tick);
        } else {
          setProgress(to);
          resolve();
        }
      };
      tick();
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="flex gap-2 items-center">
        <AppButton
          onClick={handleButtonClick}
          isLoading={uploading}
          falseName="Upload Model"
          trueName="Uploading..."
          className="bg-green-900 hover:bg-green-800 text-white"
        >
        </AppButton>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {message && (
          <p className="text-sm text-muted-foreground ml-4">{message}</p>
        )}
      </div>

      {/* Upload Progress Modal */}
      <UploadProgressModal open={uploading} progress={progress} />
    </div>
  );
};

export default Upload;
