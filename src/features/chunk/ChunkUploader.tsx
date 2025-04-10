import React, { useState } from "react";

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB

function sliceFile(file: File, chunkSize: number): Blob[] {
  const chunks = [];
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }

  return chunks;
}

const ChunkUploader: React.FC = () => {
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slicedChunks = sliceFile(file, CHUNK_SIZE);
    setChunks(slicedChunks);
    setFileInfo({ name: file.name, size: file.size });
  };

  const downloadChunk = (chunk: Blob, index: number) => {
    const url = URL.createObjectURL(chunk);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileInfo?.name || 'chunk'}-part-${index + 1}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 border rounded-xl shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Chunk File Uploader (Local Test)</h2>

      <input type="file" onChange={handleFileChange} className="mb-4" />

      {fileInfo && (
        <div className="mb-4">
          <p>📁 File: <strong>{fileInfo.name}</strong></p>
          <p>📦 Total size: {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB</p>
          <p>🧩 Chunks: <strong>{chunks.length}</strong> (1MB/chunk)</p>
        </div>
      )}

      {chunks.length > 0 && (
        <div className="max-h-64 overflow-auto text-sm  p-2 rounded-md">
          {chunks.map((chunk, index) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div>
                🧩 Chunk {index + 1}: {(chunk.size / 1024).toFixed(2)} KB
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600  text-xs px-2 py-1 rounded"
                onClick={() => downloadChunk(chunk, index)}
              >
                💾 Tải
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChunkUploader;
