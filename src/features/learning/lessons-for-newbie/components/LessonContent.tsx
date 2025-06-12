import React from "react";

interface LessonContentProps {
  title: string;
  updateDate: string;
  description: string;
  links: { href: string; text: string }[];
}

export default function LessonContent({ title, updateDate, description, links }: LessonContentProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-white/90 via-gray-50/90 to-white dark:from-zinc-900/90 dark:via-zinc-800/90 dark:to-zinc-900 p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-3 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{updateDate}</p>
        </div>
        <button className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all duration-200">
          + Thêm ghi chú
        </button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">{description}</p>

      <ul className="list-disc list-inside space-y-3">
        {links.map((link, index) => (
          <li key={index} className="text-base">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2 decoration-dotted transition-colors duration-200"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}