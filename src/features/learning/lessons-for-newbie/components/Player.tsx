// File: Player.tsx
import ReactPlayer from "react-player";
import { Lesson } from "./Type";
import { LoadingState } from "@/components/common/LoadingState";
import { PromptCard } from "./PromptCard";
import { Link } from "@tanstack/react-router";

interface PlayerProps {
  videoUrl: string;
  selectedLesson?: Lesson | null;
}

export default function Player({ videoUrl, selectedLesson }: PlayerProps) {
  const isValid = !!videoUrl;

  if (selectedLesson === null) {
    return <LoadingState />;
  }

  if (selectedLesson === undefined) {
    return (
      <div className="w-full aspect-video bg-white dark:bg-zinc-900 relative rounded-2xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-4">
          <PromptCard
            title="Please select a lesson to get started"
            description="Choose a lesson from the sidebar to begin learning. We're excited to help you grow!"
          />
        </div>
      </div>
    );
  }

  if (selectedLesson.is_locked) {
    return (
      <div className="w-full aspect-video bg-white dark:bg-zinc-900 relative rounded-2xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-4">
          <PromptCard
            title="Subscribe to Unlock This Lesson"
            description="This lesson is locked. Subscribe now to access this content and continue your learning journey!"
            action={
              <Link
                 to={`/tutorials/purchase-course?course_id=${selectedLesson?.course_id}&title=${encodeURIComponent(selectedLesson?.course?.title)}`}
                className="inline-block px-6 py-2 text-sm sm:text-base font-medium text-white bg-orange-600 rounded-full hover:bg-orange-700 dark:hover:bg-orange-500 transition-colors"
              >
                Subscribe Now
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (isValid) {
    return (
      <div className="w-full aspect-video bg-white dark:bg-zinc-900 relative rounded-2xl overflow-hidden">
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

  return (
    <div className="w-full aspect-video bg-white dark:bg-zinc-900 relative rounded-2xl overflow-hidden">
      <div className="w-full h-full flex items-center justify-center p-4">
        <PromptCard
          title="Invalid Video"
          description="The video for this lesson is not available or has been removed. Please try a different lesson or contact support for assistance."
        />
      </div>
    </div>
  );
}
