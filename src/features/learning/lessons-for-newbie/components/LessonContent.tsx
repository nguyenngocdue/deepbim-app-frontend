import React from "react";

interface LessonContentProps {
  title: string;
  updateDate: string;
  description: string;
  links: { href: string; text: string }[];
}

export default function LessonContent({ title, updateDate, description, links }: LessonContentProps) {
  return (
    <div className="w-full mx-auto bg-gradient-to-b from-gray-800/95 to-gray-900/95 dark:from-gray-900/95 dark:to-black/95 p-4 sm:p-6 rounded-2xl shadow-xl mt-4 sm:mt-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight truncate max-w-[80%]">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
            Updated: {updateDate}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-sm"
          aria-label="Add note"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Note
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
        {description}
      </p>

      {/* Links Section */}
      {links.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-medium text-gray-200 mb-3">
            Resources
          </h2>
          <ul className="space-y-2.5">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm sm:text-base text-orange-400 hover:text-orange-300 transition-colors duration-200 group"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-orange-300"
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
        </div>
      )}
    </div>
  );
}