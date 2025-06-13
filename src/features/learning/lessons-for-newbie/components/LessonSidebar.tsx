import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const sections = [
 {
    title: "I. Dynamo and Visual Studio Code",
    lessons: [
      { id: 1, title: "Part 1-1: Introduction – Install softwares for Dynamo API.", duration: "", url: "" },
      { id: 2, title: "Part 1-2: Introduction – Install softwares for Dynamo API.", duration: "", url: "" },
      { id: 3, title: "Part 1-3: Introduction – Install softwares for Dynamo API.", duration: "", url: "" },
      { id: 4, title: "Part 1-4: Introduction – Install softwares for Dynamo API.", duration: "", url: "" },
    ],
  },
  {
    title: "II. Selection",
    lessons: [
      { id: 5, title: "Part 2: Interaction with elements selection 01", duration: "", url: "" },
      { id: 6, title: "Part 2: Interaction with elements selection 02", duration: "", url: "" },
      { id: 7, title: "Part 2: Interaction with elements selection 03", duration: "", url: "" },
      { id: 8, title: "Part 2: Interaction with elements selection 04", duration: "", url: "" },
      { id: 9, title: "Part 2: Interaction with elements selection 05", duration: "", url: "" },
    ],
  },
  {
    title: "III. Filtering",
    lessons: [
      { id: 10, title: "Part 3: Interaction with elements filtering 01", duration: "", url: "" },
      { id: 11, title: "Part 3: Interaction with elements filtering 02", duration: "", url: "" },
      { id: 12, title: "Part 3: Interaction with elements filtering 03", duration: "", url: "" },
      { id: 13, title: "Part 3: Interaction with elements filtering 04", duration: "", url: "" },
      { id: 14, title: "Part 3: Interaction with elements filtering 05", duration: "", url: "" },
      { id: 15, title: "Part 3: Interaction with elements filtering 06", duration: "", url: "" },
      { id: 16, title: "Part 3: Interaction with elements filtering 07", duration: "", url: "" },
      { id: 17, title: "Part 3: Interaction with elements filtering 08", duration: "", url: "" },
      { id: 18, title: "Part 3: Interaction with elements filtering 09", duration: "", url: "" },
    ],
  },
  {
    title: "IV. Parameter",
    lessons: [
      { id: 19, title: "Interacting with objects through parameters 1", duration: "", url: "" },
      { id: 20, title: "Interacting with objects through parameters 2", duration: "", url: "" },
      { id: 21, title: "Interacting with objects through parameters 3", duration: "", url: "" },
    ],
  },
  {
    title: "V. Geometry",
    lessons: [
      { id: 22, title: "Part 3-1: Geometric elements.", duration: "", url: "" },
      { id: 23, title: "Part 3-2: Geometric elements.", duration: "", url: "" },
      { id: 24, title: "Part 3-3: Geometric elements.", duration: "", url: "" },
      { id: 25, title: "Part 3-4: Geometric elements.", duration: "", url: "" },
      { id: 26, title: "Part 3-5: Geometric elements.", duration: "", url: "" },
      { id: 27, title: "Part 3-6: Geometric elements.", duration: "", url: "" },
      { id: 28, title: "Part 3-7: Geometric elements.", duration: "", url: "" },
      { id: 29, title: "Part 3-8: Geometric elements.", duration: "", url: "" },
      { id: 30, title: "Part 3-9: Geometric elements.", duration: "", url: "" },
      { id: 31, title: "Part 3-10: Geometric elements.", duration: "", url: "" },
      { id: 32, title: "Part 3-11: Geometric elements.", duration: "", url: "" },
      { id: 33, title: "Part 3-12: Geometric elements.", duration: "", url: "" },
      { id: 34, title: "Part 3-13: Geometric elements.", duration: "", url: "" },
      { id: 35, title: "Part 3-14: Geometric elements.", duration: "", url: "" },
    ],
  },
  {
    title: "VI. Autocad",
    lessons: [
      { id: 36, title: "How to extract points (XYZ) of AutoCAD files", duration: "", url: "" },
      { id: 37, title: "Filtering the layer names of AutoCAD files", duration: "", url: "" },
      { id: 38, title: "Finding intersection points of lines of AutoCAD file", duration: "", url: "" },
    ],
  },
  {
    title: "VII. Winform",
    lessons: [
      { id: 39, title: "Creating a user interface using WinForm 1", duration: "", url: "" },
      { id: 40, title: "Creating a user interface using WinForm 2", duration: "", url: "" },
      { id: 41, title: "Creating a user interface using WinForm 3", duration: "", url: "" },
      { id: 42, title: "Creating a user interface using WinForm 4", duration: "", url: "" },
      { id: 43, title: "Creating a user interface using WinForm 5", duration: "", url: "" },
    ],
  },
  {
    title: "VIII. WPF",
    lessons: [
      { id: 44, title: "Creating a user interface using WPF 1", duration: "", url: "" },
      { id: 45, title: "Creating a user interface using WPF 2", duration: "", url: "" },
      { id: 46, title: "Creating a user interface using WPF 3", duration: "", url: "" },
      { id: 47, title: "Creating a user interface using WPF 4", duration: "", url: "" },
      { id: 48, title: "Creating a user interface using WPF 5", duration: "", url: "" },
      { id: 49, title: "Creating a user interface using WPF 6", duration: "", url: "" },
      { id: 50, title: "Creating a user interface using WPF 7", duration: "", url: "" },
      { id: 51, title: "Creating a user interface using WPF 8", duration: "", url: "" },
      { id: 52, title: "Creating a user interface using WPF 9", duration: "", url: "" },
    ],
  },
];



export default function LessonSidebar() {
  const [activeLessonId, setActiveLessonId] = useState(null);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-gray-900 to-black shadow-xl">
      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
        <h2 className="text-lg font-semibold text-white tracking-tight sm:text-xl md:text-lg lg:text-xl">
          Nội dung khóa học
        </h2>
      </div>

      {/* Scrollable Section List */}
      <aside className="flex-1 max-h-[calc(100vh-80px)] overflow-y-auto px-2 py-4 space-y-3">
        {sections.map((section, i) => (
          <Collapsible
            key={i}
            defaultOpen={i === 0}
            className="border border-gray-700 rounded-xl overflow-hidden shadow-sm"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300 text-white font-medium text-sm sm:text-base md:text-sm lg:text-base group">
              <span className="truncate max-w-[85%]">{section.title}</span>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 group-data-[state=open]:rotate-90 transition-transform duration-300 ease-in-out" />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-gray-900/60">
              {section.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3 sm:p-4 text-sm sm:text-base flex justify-between items-center transition-colors duration-300 rounded-lg ${
                    activeLessonId === lesson.id
                      ? "bg-orange-500/30 text-orange-200 border-l-4 border-orange-500"
                      : "bg-gray-800/60 hover:bg-gray-700/90 text-gray-200"
                  }`}
                  aria-label={`Chọn bài học: ${lesson.title}`}
                >
                  <span className="truncate max-w-[70%] sm:max-w-[75%]">{lesson.title}</span>
                  <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                    {lesson.duration}
                  </span>
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </aside>
    </div>
  );
}