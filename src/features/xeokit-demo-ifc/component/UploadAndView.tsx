import { useState } from "react";
import { XeokitViewer } from "./XeokitViewer";

export function UploadAndView() {
  const [xktUrl, setXktUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:3000/api/upload-ifc", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setXktUrl(data.xktUrl);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <input type="file" accept=".ifc" onChange={handleUpload} />
      {xktUrl && <XeokitViewer src={xktUrl} />}
    </div>
  );
}