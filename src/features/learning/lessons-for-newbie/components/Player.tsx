import ReactPlayer from "react-player";

interface PlayerProps {
  videoId: string; // Ví dụ: "dQw4w9WgXcQ"
}

export default function Player({ videoId }: PlayerProps) {
  return (
    <div className="w-full aspect-video bg-zinc-900">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}`}
        width="100%"
        height="100%"
        controls
        playing={false} // Tự động play nếu true
        className="w-full h-full"
      />
    </div>
  );
}