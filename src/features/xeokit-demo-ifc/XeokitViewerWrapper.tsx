import { useEffect, useState } from "react";
import { XeokitViewer } from "../bim-viewer2/instance-page/rac-house-autodesk/components/XeokitViewer";
import { getMediaById } from "@/apis/media-api";



interface XeokitViewerWrapperProps {
  mediaId: number;
}

export function XeokitViewerWrapper({ mediaId = 225 }: XeokitViewerWrapperProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMediaById(mediaId)
      .then((media) => setUrl(media.data.url))
      .catch((err) => setError(err.message));
  }, [mediaId]);

  if (error) return <p>Lỗi: {error}</p>;
  if (!url) return <p>Đang tải file...</p>;

  return <XeokitViewer src={url} />;
}
