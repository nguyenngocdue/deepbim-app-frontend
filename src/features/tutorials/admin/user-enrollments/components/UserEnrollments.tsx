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
    <div className="p-4 bg-gray-900 text-white rounded-xl shadow-lg">
      <div className="overflow-x-auto relative">
        <table className="min-w-full text-sm border-separate border-spacing-0">
          <thead>
            {/* Row 1: Khóa học */}
            <tr>
              <th
                rowSpan={2}
                className="sticky top-0 left-0 z-[50] bg-gray-800 px-4 py-3 text-left font-semibold"
              >
                User
              </th>
              <th
                rowSpan={2}
                className="sticky top-0 z-[40] bg-gray-800 px-4 py-3 text-center text-orange-400"
              >
                All
              </th>
              {Object.entries(grouped).map(([courseTitle, lessons]) => (
                <th
                  key={courseTitle}
                  colSpan={lessons.length}
                  className="sticky top-0 z-[40] bg-gray-900 px-4 py-3 text-center text-orange-300"
                >
                  {courseTitle}
                </th>
              ))}
            </tr>

            {/* Row 2: Lesson titles + toggle column */}
            <tr>
              {flatLessons.map((lesson) => (
                <th
                  key={lesson.id}
                  className="sticky top-[52px] z-[30] bg-gray-800 px-2 py-2 text-gray-300 text-xs text-center font-normal"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="truncate">{lesson.title}</span>
                    <input
                      type="checkbox"
                      className="scale-110 accent-orange-500"
                      checked={users.every((u) => permissions[u.id]?.has(lesson.id))}
                      onChange={() => toggleAllUsersForLesson(lesson.id)}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800 transition">
                <td className="sticky left-0 z-[40] bg-gray-900 px-4 py-2 font-medium whitespace-nowrap">
                  {user.user_name}
                </td>
                <td className="text-center bg-gray-800">
                  <input
                    type="checkbox"
                    className="scale-110 accent-orange-500"
                    checked={flatLessons.every((l) => permissions[user.id]?.has(l.id))}
                    onChange={() => toggleAllLessonsForUser(user.id)}
                  />
                </td>
                {flatLessons.map((lesson) => (
                  <td key={lesson.id} className="text-center">
                    <input
                      type="checkbox"
                      checked={permissions[user.id]?.has(lesson.id) || false}
                      onChange={() => togglePermission(user.id, lesson.id)}
                      className="accent-orange-500 scale-110"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => onApply(permissions)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg transition"
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
