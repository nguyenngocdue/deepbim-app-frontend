import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PDFViewerModal } from "./PDFViewerModal";
import PDFReader from "./PDFReader";

interface FileItem {
  id: number;
  name: string;
  type?: string;
  media?: {
    url: string;
    extension: string;
  };
}

interface FolderContentProps {
  files: FileItem[];
  view: "list" | "grid";
}

const getIconUrlByType = (type: string) => {
  switch (type) {
    case "pdf": return "https://img.icons8.com/color/96/pdf.png";
    case "note": return "https://img.icons8.com/color/96/document--v1.png";
    case "image": return "https://img.icons8.com/color/96/image.png";
    case "video": return "https://img.icons8.com/color/96/video.png";
    case "ifc": return "https://img.icons8.com/color/96/building.png";
    case "folder": return "https://img.icons8.com/color/96/folder-invoices--v1.png";
    default: return "https://img.icons8.com/color/96/file.png";
  }
};

export const FolderContent: React.FC<FolderContentProps> = ({ files, view }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  if (view === "list") {
    return (
      <TooltipProvider>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-3 px-4 text-sm text-zinc-400 border-b border-zinc-700 pb-1 font-medium">
            <span>Icon</span>
            <span className="col-span-2">File name</span>
            <span>Type</span>
            <span>Action</span>
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-5 gap-3 items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-sm"
            >
              <img
                src={getIconUrlByType(file.type || "")}
                alt={file.name}
                className="w-6 h-6 object-contain"
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="col-span-2 truncate cursor-default">
                    {file.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{file.name}</TooltipContent>
              </Tooltip>

              <span className="text-zinc-400">{file.media?.extension || "-"}</span>

              <div>
                {file.media?.url ? (
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      if (file.media?.url.endsWith(".pdf")) {
                        setPdfUrl(file.media.url);
                      } else {
                        window.open(file.media.url, "_blank");
                      }
                    }}
                    href={file.media?.url}
                    className="text-blue-400 hover:underline text-xs cursor-pointer"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-zinc-500 text-xs">No link</span>
                )}
              </div>
            </div>
          ))}

          {pdfUrl && (
            <PDFViewerModal
              open={!!pdfUrl}
              onClose={() => setPdfUrl(null)}
              pdfUrl='/deepbim_db_v1.pdf'
              title="Preview PDF"
            />
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex flex-col items-center bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition group"
          >
            <img
              src={getIconUrlByType(file.type || "")}
              alt={file.name}
              className="w-10 h-10 object-contain mb-2"
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-center truncate w-full text-white cursor-default">
                  {file.name}
                </p>
              </TooltipTrigger>
              <TooltipContent>{file.name}</TooltipContent>
            </Tooltip>

            {file.media?.url ? (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  if (file.media?.url.endsWith(".pdf")) {
                    setPdfUrl(file.media.url);
                  } else {
                    window.open(file.media.url, "_blank");
                  }
                }}
                href={file.media?.url}
                className="text-xs text-blue-400 mt-1 hover:underline"
              >
                View
              </a>
            ) : (
              <span className="text-xs text-zinc-500 mt-1">No link</span>
            )}
          </div>
        ))}
      </div>

      {pdfUrl && (
        <PDFReader/>
      )}
    </TooltipProvider>
  );
};