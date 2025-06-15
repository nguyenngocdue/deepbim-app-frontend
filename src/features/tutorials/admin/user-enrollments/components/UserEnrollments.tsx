import { useState } from "react";
import type { Lesson } from "@/components/courses/Types";
import type { User } from "@/features/auth/user-manager/users/components/Type";

interface Props {
  users: User[];
  lessons: Lesson[];
  initialPermissions: Record<number, number[] | Set<number>>; // <-- support cả array
  onApply: (data: Record<number, Set<number>>) => void;
}

export default function UserEnrollments({
  users,
  lessons,
  initialPermissions,
  onApply,
}: Props) {
  // ✅ Convert all to Set<number>
  const [permissions, setPermissions] = useState<Record<number, Set<number>>>(() => {
    const fixed: Record<number, Set<number>> = {};
    for (const [userId, value] of Object.entries(initialPermissions)) {
      fixed[+userId] = new Set(value);
    }
    return fixed;
  });

  const grouped = groupLessonsByCourse(lessons);
  const flatLessons = Object.values(grouped).flat();

  const togglePermission = (userId: number, lessonId: number) => {
    setPermissions((prev) => {
      const updated = new Set(prev[userId]);
      updated.has(lessonId) ? updated.delete(lessonId) : updated.add(lessonId);
      return { ...prev, [userId]: updated };
    });
  };

  const toggleAllLessonsForUser = (userId: number) => {
    const hasAll = flatLessons.every((l) => permissions[userId]?.has(l.id));
    const newSet = hasAll ? new Set() : new Set(flatLessons.map((l) => l.id));
    setPermissions((prev) => ({ ...prev, [userId]: newSet }));
  };

  const toggleAllUsersForLesson = (lessonId: number) => {
    const hasAll = users.every((user) => permissions[user.id]?.has(lessonId));
    setPermissions((prev) => {
      const updated = { ...prev };
      users.forEach((user) => {
        const set = new Set(updated[user.id] ?? []);
        hasAll ? set.delete(lessonId) : set.add(lessonId);
        updated[user.id] = set;
      });
      return updated;
    });
  };


  return (
  <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-2xl">
    <div className="overflow-x-auto relative rounded-xl border border-gray-700 backdrop-blur-sm">
      <table className="min-w-full text-sm border-separate border-spacing-0">
        <thead>
          {/* Row 1: Course Titles */}
          <tr>
            <th
              rowSpan={2}
              className="sticky top-0 left-0 z-[50] bg-gray-800 px-6 py-4 text-left font-bold text-lg text-teal-300 border-r border-b border-gray-600 shadow-inner"
            >
              User
            </th>
            <th
              rowSpan={2}
              className="sticky top-0 z-[40] bg-gray-800 px-6 py-4 text-center font-bold text-lg text-teal-400 border-b border-gray-600 shadow-inner"
            >
              All
            </th>
            {Object.entries(grouped).map(([courseTitle, lessons]) => (
              <th
                key={courseTitle}
                colSpan={lessons.length}
                className="border sticky top-0 z-[40] bg-gray-900 px-6 py-4 text-center font-semibold text-base text-teal-200 border-b border-gray-600 shadow-inner"
              >
                {courseTitle}
              </th>
            ))}
          </tr>

          {/* Row 2: Lesson Titles + Toggle Column */}
          <tr>
            {flatLessons.map((lesson) => (
              <th
                key={lesson.id}
                className="sticky top-[64px] z-[30] bg-gray-800 px-4 py-3 text-gray-300 text-xs font-medium text-center border-b border-gray-600 hover:bg-gray-700 transition duration-200"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="truncate max-w-[120px] text-teal-100">{lesson.title}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={users.every((u) => permissions[u.id]?.has(lesson.id))}
                      onChange={() => toggleAllUsersForLesson(lesson.id)}
                    />
                    <div className="w-6 h-3 bg-gray-600 peer-focus:outline-none rounded-full peer-checked:bg-teal-400 transition-all duration-300"></div>
                    <div className="absolute left-0 w-3 h-3 bg-gray-300 rounded-full peer-checked:bg-teal-100 peer-checked:translate-x-3 transition-transform duration-300"></div>
                  </label>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-750 transition duration-300 ease-in-out hover:shadow-md"
            >
              <td className="sticky left-0 z-[40] bg-gray-900 px-6 py-3 font-medium text-base text-teal-200 border-r border-gray-600 whitespace-nowrap">
                {user.user_name}
              </td>
              <td className="text-center bg-gray-800 border-r border-gray-600">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={flatLessons.every((l) => permissions[user.id]?.has(l.id))}
                    onChange={() => toggleAllLessonsForUser(user.id)}
                  />
                  <div className="w-6 h-3 bg-gray-600 peer-focus:outline-none rounded-full peer-checked:bg-teal-400 transition-all duration-300"></div>
                  <div className="absolute left-0 w-3 h-3 bg-gray-300 rounded-full peer-checked:bg-teal-100 peer-checked:translate-x-3 transition-transform duration-300"></div>
                </label>
              </td>
              {flatLessons.map((lesson) => (
                <td key={lesson.id} className="text-center hover:bg-gray-700 transition duration-200">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={permissions[user.id]?.has(lesson.id) || false}
                      onChange={() => togglePermission(user.id, lesson.id)}
                    />
                    <div className="w-6 h-3 bg-gray-600 peer-focus:outline-none rounded-full peer-checked:bg-teal-400 transition-all duration-300"></div>
                    <div className="absolute left-0 w-3 h-3 bg-gray-300 rounded-full peer-checked:bg-teal-100 peer-checked:translate-x-3 transition-transform duration-300"></div>
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-8 text-right">
      <button
        onClick={() => onApply(permissions)}
        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:bg-teal-800"
      >
        Apply
      </button>
    </div>
  </div>
);

}

// Helper to group lessons by course title
function groupLessonsByCourse(lessons: Lesson[]): Record<string, Lesson[]> {
  return lessons.reduce((acc, lesson) => {
    const course = lesson.course?.title ?? "Unknown Course";
    if (!acc[course]) acc[course] = [];
    acc[course].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);
}
