import CustomBadge from "@/components/common/CustomBadge";
import { useState } from "react";
import { Lesson } from "./Type";

interface LessonContentData {
  updateDate: string;
  description_lesson: string;
  links?: { href: string; text: string; type?: string }[];
  tags?: string[];
  progress?: number;
}

interface LessonContentProps {
  contents?: LessonContentData;
  selectedLesson?: Lesson;
}

export default function LessonContent({ contents, selectedLesson }: LessonContentProps) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6">
      <div>
        <h1 className="text-2xl sm:text-2xl font-semibold text-white tracking-tight text-ellipsis overflow-hidden hover:text-orange-300 transition-colors duration-200">
          {selectedLesson?.title || "Không có tiêu đề"}
        </h1>
        {contents?.updateDate && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 mt-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Updated: {contents.updateDate}
          </div>
        )}
      </div>

      <button
        title="Add a new note to this lesson"
        className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Note
        <CustomBadge text="dev" type="dev" className="absolute -top-2 -right-2" />
      </button>
    </div>
  );

  if (!contents || !contents.description_lesson) {
    return (
      <div className="w-full mx-auto bg-gradient-to-b from-gray-900 to-blue-900 dark:from-gray-950 dark:to-black p-8 sm:p-8 rounded-3xl shadow-lg mt-6">
        {renderHeader()}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-8 h-8 text-orange-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-md font-semibold text-white mb-4">
            Chúng tôi đang cập nhật
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            Nội dung đang được chuẩn bị. Vui lòng quay lại sau!
          </p>
          <div className="mt-6 animate-pulse">
            <div className="h-8 bg-gray-700/50 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-16 bg-gray-700/50 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const { updateDate, description_lesson, links = [], tags = [], progress = 0 } = contents;

  return (
    <div className="w-full mx-auto bg-gradient-to-b from-gray-900 to-blue-900 dark:from-gray-950 dark:to-black p-8 sm:p-8 rounded-3xl shadow-lg mt-6">
      {renderHeader()}

      {progress > 0 && (
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-orange-400" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <p className="text-gray-100 text-sm sm:text-base leading-7 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-800 mb-8 text-left">
        {description_lesson}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <CustomBadge key={index} text={tag} type="tag" />
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-5">
          <button
            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-200 mb-3"
          >
            Resources
            <svg
              className={`w-4 h-4 transform ${isResourcesOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isResourcesOpen && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {links.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 bg-gray-700/30 rounded-lg p-3"
                >
                  <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                    {link.type || "Link"}
                  </span>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm sm:text-base text-orange-400 hover:text-orange-300 transition-colors duration-200 group"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-orange-300 transform group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span className="underline underline-offset-4 decoration-orange-400/30 group-hover:decoration-orange-300/50">
                      {link.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}