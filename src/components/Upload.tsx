import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const isLoggedIn = !!localStorage.getItem("accessToken"); 
  console.log(isLoggedIn)

  const handleButtonClick = () => {
    if (!isLoggedIn) {
        setMessage("❌ You must be logged in to upload a file.");
        return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setMessage("✅ Upload successful!");
      console.log(result);
    } catch (error: any) {
      setMessage("❌ Upload error: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <div className="space-y-2">
      {/* Only show a single button */}
      <Button
        onClick={handleButtonClick}
        disabled={uploading}
        className="bg-green-900 hover:bg-green-800 text-white"
      >
        {uploading ? "Uploading..." : "Upload Model"}
      </Button>

      {/* Hidden file input, triggered by button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload status message */}
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};

export default Upload;
