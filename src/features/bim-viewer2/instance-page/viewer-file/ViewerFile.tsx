import { getMediaByViewId } from "@/apis/media-api";
import ViewerCanvas from "../../components/ViewerCanvas"
import React, { useEffect, useState } from "react";

interface ViewerFileProps {
  viewId: string; // Change 'string' to the correct type if needed
}


export default function ViewerFile({viewId}: ViewerFileProps) {
    const [media, setMedia] = useState<any>(null);
    const [mediaUrl, setMediaUrl] = useState('');

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await getMediaByViewId(viewId);
                const data = res.data;
                setMedia(res.data);
                if (data.url_skt) {
                    setMediaUrl(data.url_skt);
                } else {
                    setMediaUrl(data.url);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchMedia();
    }, [viewId]);


    const modelConfig = {
        id: viewId,
        src: mediaUrl,    
        edges: true,
    };

    return <ViewerCanvas modelConfig={modelConfig} />;
}
