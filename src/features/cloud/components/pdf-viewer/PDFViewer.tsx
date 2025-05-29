import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";
import { LoadingState } from "@/components/common/LoadingState";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type PDFViewerProps = {
  url: string;
  maxWidth?: number;
  maxHeight?: number;
};

export default function PDFViewer({
  url,
  maxWidth = 900,
  maxHeight = 600,
}: PDFViewerProps) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [fitMode, setFitMode] = useState<"width" | "height" | "auto">("auto");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen handlers
  const enterFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  // Theo dõi khi vào/thoát fullscreen
  useEffect(() => {
    function onFullscreenChange() {
      const isFs =
        document.fullscreenElement === containerRef.current ||
        // Một số trình duyệt dùng webkit
        (document as any).webkitFullscreenElement === containerRef.current;
      setIsFullscreen(isFs);
      // Khi vào fullscreen thì set fitMode width để fit canvas, khi thoát trả về auto
      if (isFs) setFitMode("width");
      else setFitMode("auto");
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange); // Safari

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  // Load PDF
  useEffect(() => {
    setLoading(true);
    setError(null);
    setPdf(null);
    setPageNumber(1);
    getDocument(url).promise
      .then((pdfDoc) => {
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load PDF. " + err.message);
        setLoading(false);
      });
  }, [url]);

  // Render page (auto scale)
  useEffect(() => {
    if (!pdf || !canvasRef.current || !containerRef.current) return;
    setLoading(true);
    pdf.getPage(pageNumber).then((page) => {
      let w = maxWidth, h = maxHeight;
      if (isFullscreen) {
        w = window.innerWidth;
        h = window.innerHeight;
      } else if (containerRef.current) {
        w = containerRef.current.offsetWidth;
        h = containerRef.current.offsetHeight;
      }
      const rawViewport = page.getViewport({ scale: 1.0, rotation });
      let renderScale = scale;

      // Nếu fitMode thì tính fit scale, NGƯỢC LẠI dùng scale user
      if (fitMode === "width") renderScale = w / rawViewport.width;
      else if (fitMode === "height") renderScale = h / rawViewport.height;
      // fitMode auto thì lấy scale của user

      const viewport = page.getViewport({ scale: renderScale, rotation });

      const canvas = canvasRef.current!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      page
        .render({ canvasContext: ctx!, viewport })
        .promise.then(() => setLoading(false))
        .catch(() => setLoading(false));
    });
    // eslint-disable-next-line
  }, [pdf, pageNumber, scale, maxWidth, maxHeight, rotation, fitMode, isFullscreen]);

  // Controls
  const goToPreviousPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));
  const zoomOut = () => {
    setFitMode("auto");
    setScale((s) => Math.max(0.4, s - 0.15));
  };
  const zoomIn = () => {
    setFitMode("auto");
    setScale((s) => Math.min(2.2, s + 0.15));
  };
  const rotate = () => setRotation((r) => (r + 90) % 360);
  const fitToWidth = () => setFitMode("width");
  const fitToHeight = () => setFitMode("height");
  const resetView = () => {
    setFitMode("auto");
    setScale(1.0);
    setRotation(0);
  };

  // Goto page
  const [gotoValue, setGotoValue] = useState("");
  const gotoPage = (e) => {
    e.preventDefault();
    let val = parseInt(gotoValue);
    if (!isNaN(val) && val >= 1 && val <= numPages) setPageNumber(val);
    setGotoValue("");
  };

  // Download
  const downloadPdf = () => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = url.split("/").pop() || "document.pdf";
        link.click();
      });
  };

  // Print
  const printPdf = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    const win = window.open("");
    win!.document.write(
      `<iframe src="${dataUrl}" frameborder="0" style="width:100vw;height:100vh"></iframe>`
    );
    setTimeout(() => win!.print(), 300);
  };

  // Keyboard: left/right/home/end
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPreviousPage();
      if (e.key === "ArrowRight") goToNextPage();
      if (e.key === "Home") setPageNumber(1);
      if (e.key === "End") setPageNumber(numPages);
      if (e.ctrlKey && (e.key === "+" || e.key === "=")) { e.preventDefault(); zoomIn(); }
      if (e.ctrlKey && e.key === "-") { e.preventDefault(); zoomOut(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line
  }, [pageNumber, numPages, scale]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center w-full bg-transparent ${isFullscreen ? "fixed inset-0 z-[9999] bg-black" : ""}`}
      style={{
        width: isFullscreen ? "100vw" : undefined,
        height: isFullscreen ? "100vh" : undefined,
        overflow: "auto",
      }}
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-white/90 dark:bg-zinc-800/90 rounded-lg shadow px-4 py-2 border border-gray-200 dark:border-zinc-700 z-10 mt-4">
        <button onClick={goToPreviousPage} disabled={pageNumber <= 1 || loading} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-40" title="Previous">◀</button>
        <form onSubmit={gotoPage} className="flex gap-1 items-center">
          <input type="number" min={1} max={numPages} value={gotoValue} onChange={e => setGotoValue(e.target.value)} placeholder={pageNumber.toString()} className="w-12 px-1 rounded border text-center bg-transparent dark:bg-zinc-800" />
          <button type="submit" className="px-2 text-sm text-gray-600 dark:text-gray-300">Go</button>
        </form>
        <span className="font-mono text-base select-none dark:text-gray-100">/ {numPages}</span>
        <button onClick={goToNextPage} disabled={pageNumber >= numPages || loading} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-40" title="Next">▶</button>
        <div className="mx-2 border-l border-gray-200 dark:border-zinc-600 h-5"></div>
        <button onClick={zoomOut} disabled={scale <= 0.5 || loading || fitMode !== "auto"} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-40" title="Zoom out">-</button>
        <span className="w-12 text-center dark:text-gray-100">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} disabled={scale >= 2.2 || loading || fitMode !== "auto"} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-40" title="Zoom in">+</button>
        <div className="mx-2 border-l border-gray-200 dark:border-zinc-600 h-5"></div>
        <button onClick={rotate} title="Rotate 90°" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700">⟳</button>
        <button onClick={fitToWidth} title="Fit to Width" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700">↔</button>
        <button onClick={fitToHeight} title="Fit to Height" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700">↕</button>
        <button onClick={resetView} title="Reset view" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700">⟳ Reset</button>
        <div className="mx-2 border-l border-gray-200 dark:border-zinc-600 h-5"></div>
        {!isFullscreen && <button onClick={enterFullscreen} title="Fullscreen" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700">⛶</button>}
        <button onClick={downloadPdf} title="Download PDF" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700">⭳</button>
        <button onClick={printPdf} title="Print" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700">🖨️</button>
      </div>
      {/* Viewer */}
      <div
        className="relative flex items-center justify-center w-full"
        style={{
          minHeight: 180,
          maxHeight: isFullscreen ? "100vh" : maxHeight,
          maxWidth: isFullscreen ? "100vw" : maxWidth,
          overflow: "auto",
        }}
      >
        {error && <div className="text-red-500">{error}</div>}
        {loading && (<LoadingState/>)}
        <canvas
          ref={canvasRef}
          className="rounded shadow-lg border bg-white dark:bg-zinc-900 mx-auto"
          style={{
            maxWidth: isFullscreen ? "100vw" : "90vw",
            maxHeight: isFullscreen ? "100vh" : "60vh",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}
