import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";

const ChunkedModelLoader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [log, setLog] = useState<string[]>([]);

  const logMsg = (msg: string) => setLog((prev) => [...prev, msg]);

  

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    logMsg(`🧩 ${files.length} chunks selected.`);

    const sortedChunks = files.sort((a, b) => a.name.localeCompare(b.name));
    logMsg("📚 Sorted chunk files.");

    try {
      const blobs = await Promise.all(sortedChunks.map(readFileAsBlob));
      const merged = new Blob(blobs, { type: "application/octet-stream" });
      logMsg("📦 Merged into single Blob.");

      const components = new OBC.Components;
      const fragments = components.get(OBC.FragmentsManager);
      await fragments?.load(merged);
      logMsg("✅ Model loaded via OBC.FragmentsManager.");
    } catch (err) {
      console.error(err);
      logMsg("❌ Error during merge or load.");
    }
  };

  const readFileAsBlob = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Blob([reader.result as ArrayBuffer]));
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="w-full p-4 border-t border-gray-300">
      <h2 className="text-lg font-semibold mb-2">🔧 Load IFC từ các chunk (OBC Viewer)</h2>

      <input
        type="file"
        ref={inputRef}
        multiple
        accept=".part,.ifc"
        onChange={handleFileSelect}
        className="mb-4"
      />

      <div className="bg-gray-100 p-2 rounded-md text-sm max-h-64 overflow-auto">
        {log.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default ChunkedModelLoader;
