// File: Player.tsx
import ReactPlayer from "react-player";
import { Lesson } from "./Type";
import { LoadingState } from "@/components/common/LoadingState";
import { PromptCard } from "./PromptCard";
import { RegisterPopup } from "@/features/tutorials/components/RegisterPopup";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";

interface PlayerProps {
  videoUrl: string;
  selectedLesson?: Lesson | null;
}

export default function Player({ videoUrl, selectedLesson }: PlayerProps) {
  const isValid = !!videoUrl;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
      <>
        <div className="w-full aspect-video bg-white dark:bg-zinc-900 relative rounded-2xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center p-4">
            <PromptCard
              title="Subscribe to Unlock This Lesson"
              description="This lesson is locked. Subscribe now to access this content and continue your learning journey!"
              action={
                <Button
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm sm:text-base font-medium dark:bg-orange-600 dark:text-white  text-white bg-[#40DBCB] hover:bg-[#2fcbb8] dark:hover:bg-[#52e1d0] rounded-full shadow-lg transition-colors"
                  onClick={() => setIsPopupOpen(true)}
                >
                  <RocketIcon className="w-4 h-4" />
                  Subscribe Now
                </Button>

              }
            />
          </div>
        </div>
        <RegisterPopup
          courseId={selectedLesson?.course_id}
          title={selectedLesson?.course?.title}
          onClose={() => setIsPopupOpen(false)}
          open={isPopupOpen}
        />
      </>
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
