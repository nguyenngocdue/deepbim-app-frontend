import { useState } from "react";
import type { Lesson } from "@/components/courses/Types";
import type { User } from "@/features/auth/user-manager/users/components/Type";

interface SearchUserProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

function SearchUser({ onSearch, onClear }: SearchUserProps) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search users by name..."
        className="w-full max-w-md px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
      />
      {query && (
        <button
          onClick={handleClear}
          className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Clear
        </button>
      )}
    </div>
  );
}

interface UserEnrollmentsProps {
  users: User[];
  lessons: Lesson[];
  initialPermissions: Record<number, number[] | Set<number>>;
  onApply: (data: Record<number, Set<number>>) => void;
}

export default function UserEnrollments({
  users,
  lessons,
  initialPermissions,
  onApply,
}: UserEnrollmentsProps) {
  // Convert all to Set<number>
  const [permissions, setPermissions] = useState<Record<number, Set<number>>>(() => {
    const fixed: Record<number, Set<number>> = {};
    for (const [userId, value] of Object.entries(initialPermissions)) {
      fixed[+userId] = new Set(value);
    }
    return fixed;
  });

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Calculate users to display on current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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
    const hasAll = filteredUsers.every((user) => permissions[user.id]?.has(lessonId));
    setPermissions((prev) => {
      const updated = { ...prev };
      filteredUsers.forEach((user) => {
        const set = new Set(updated[user.id] ?? []);
        hasAll ? set.delete(lessonId) : set.add(lessonId);
        updated[user.id] = set;
      });
      return updated;
    });
  };

  // Pagination navigation
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page on clear
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-2xl">
      {/* Search Component */}
      <SearchUser onSearch={handleSearch} onClear={handleClearSearch} />

      <div className="overflow-x-auto relative rounded-xl border border-gray-700 backdrop-blur-sm">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="sticky top-0 left-0 z-[50] bg-gray-800 px-6 py-4 text-left font-bold text-lg text-teal-300 border-r border-b border-gray-600 shadow-inner"
                >
                  No
                </th>
                <th
                  rowSpan={2}
                  className="sticky top-0 left-[80px] z-[50] bg-gray-800 px-6 py-4 text-left font-bold text-lg text-teal-300 border-r border-b border-gray-600 shadow-inner"
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
                    className="sticky top-0 z-[40] bg-gray-900 px-6 py-4 text-center font-semibold text-base text-teal-200 border-b border-gray-600 shadow-inner"
                  >
                    {courseTitle}
                  </th>
                ))}
              </tr>
              <tr>
                {flatLessons.map((lesson) => (
                  <th
                    key={lesson.id}
                    className="sticky top-[64px] z-[30] bg-gray-800 px-4 py-3 text-gray-300 text-xs font-medium text-center border-b border-gray-600 hover:bg-gray-700 transition duration-200"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span
                        title={`Id: #${lesson.id}, Course ID: #${lesson.course?.id ?? 'N/A'}`}
                        className="truncate max-w-[120px] text-teal-100"
                      >
                        {lesson.title}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={filteredUsers.every((u) => permissions[u.id]?.has(lesson.id))}
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
              {currentUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-750 transition duration-300 ease-in-out hover:shadow-md"
                >
                  <td className="sticky left-0 z-[40] bg-gray-900 px-6 py-3 font-medium text-base text-teal-200 border-r border-gray-600 whitespace-nowrap">
                    {indexOfFirstUser + index + 1}
                  </td>
                  <td
                    title={`Id: #${user.id}`}
                    className="sticky left-[80px] z-[40] bg-gray-900 px-6 py-3 font-medium text-base text-teal-200 border-r border-gray-600 whitespace-nowrap"
                  >
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
                    <td
                      title={`Course status: ${lesson.course.status.name}`}
                      key={lesson.id}
                      className={`text-center hover:bg-gray-700 transition duration-200 ${lesson.course.status.class_name}`}
                    >
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
      </div>

      {/* Total Rows and Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-teal-200">
          Total Users: {totalUsers}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition duration-200"
          >
            Previous
          </button>
          <span className="text-teal-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition duration-200"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-4 text-right">
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