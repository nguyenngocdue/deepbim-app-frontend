'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

import { Document, Page } from 'react-pdf';

import { pdfjs } from "react-pdf";



interface PDFViewerModalProps {
  open: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

export const PDFViewerModal = ({ open, onClose, pdfUrl, title }: PDFViewerModalProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

  console.log(pdfUrl);
  const handlePrevious = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* PDF Navigation Controls */}
          <div className="flex items-center justify-between mb-2 text-sm text-zinc-400">
            <button onClick={handlePrevious} className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600">Previous</button>
            <span>Page {pageNumber} / {numPages || "?"}</span>
            <button onClick={handleNext} className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600">Next</button>
          </div>

          <div className="flex-1 overflow-y-auto border rounded bg-white p-4">
            <Document
              options={options}
              file={'./deepbim_db_v1.pdf'}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setPageNumber(1);
              }}
              loading={<div className="text-center text-zinc-500">Đang tải tài liệu...</div>}
              error={<div className="text-center text-red-500">Không thể tải file PDF.</div>}
            >
              <Page pageNumber={pageNumber} scale={scale} />
            </Document>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
