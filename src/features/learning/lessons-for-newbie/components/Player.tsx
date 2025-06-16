import ReactPlayer from "react-player";
import { Lesson } from "./Type";
import { LoadingState } from "@/components/common/LoadingState";
import { PromptCard } from "./PromptCard";

interface PlayerProps {
  videoUrl: string;
  selectedLesson?: Lesson | null;
}

export default function Player({ videoUrl, selectedLesson }: PlayerProps) {
  const isValid = !!videoUrl;

  // CASE 0: still loading (selectedLesson === null)
  if (selectedLesson === null) {
    return <LoadingState />;
  }

  // CASE 1: no lesson selected yet (undefined)
  if (selectedLesson === undefined) {
    return (
      <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-4">
          <PromptCard
            title="Please select a lesson to get started"
            description="Choose a lesson from the sidebar to begin learning. We're excited to help you grow!"
          />
        </div>
      </div>
    );
  }

  // CASE 2: lesson is locked
  if (selectedLesson.is_locked) {
    return (
      <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-4">
          <PromptCard
            title="Subscribe to Unlock This Lesson"
            description="This lesson is locked. Subscribe now to access this content and continue your learning journey!"
            action={
              <a
                href="/subscribe"
                className="inline-block px-6 py-2 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              >
                Subscribe Now
              </a>
            }
          />
        </div>
      </div>
    );
  }

  // CASE 3: valid video
  if (isValid) {
    return (
      <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls
          playing={false}
          className="w-full h-full"
        />
      </div>
    );
  }

  // CASE 4: fallback - invalid video
  return (
    <div className="w-full aspect-video bg-zinc-900 relative rounded-2xl overflow-hidden">
      <div className="w-full h-full flex items-center justify-center p-4">
        <PromptCard
          title="Invalid Video"
          description="The video for this lesson is not available or has been removed. Please try a different lesson or contact support for assistance."
        />
      </div>
    </div>
  );
}