import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getLessons } from "@/apis/lesson-api";
import { getUserEnrollments } from "@/apis/enrollment-api";
import {
  getInitialPermissions,
  setBulkUserLessonAccesses,
} from "@/apis/user-lesson-access-api";

import type { Lesson } from "@/components/courses/Types";
import type { User } from "@/features/auth/user-manager/users/components/Type";

import UserEnrollments from "./components/UserEnrollments";

export default function UserEnrollmentsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<User[]>([]);
  const [initialPermissions, setInitialPermissions] = useState<
    Record<number, number[] | Set<number>>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [enrollmentsRes, lessonsRes, permissionsRes] = await Promise.all([
          getUserEnrollments(),
          getLessons(),
          getInitialPermissions(),
        ]);

        if (enrollmentsRes.ok) {
          const users = enrollmentsRes.data.map((item) => item.user);
          setEnrolledUsers(users);
        }

        if (permissionsRes.ok) {
          setInitialPermissions(permissionsRes.data);
        }

        setLessons(lessonsRes.data);
      } catch (err) {
        setError("Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleApply = async (updatedPermissions: Record<number, Set<number>>) => {
    setIsSaving(true);

    try {
      const accessMap: Record<number, number[]> = {};
      for (const [userId, lessonSet] of Object.entries(updatedPermissions)) {
        accessMap[+userId] = Array.from(lessonSet);
      }

      const response = await setBulkUserLessonAccesses(accessMap);

      if (response.ok) {
        toast.success("Permissions updated successfully.");
      } else {
        toast.error("Failed to update permissions.");
      }
    } catch (error: any) {
      toast.error("Error saving permissions", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-950 to-black text-white">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">
        Lesson Access Control
      </h1>

      {loading && <p className="text-orange-300">Loading lessons...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <UserEnrollments
          users={enrolledUsers}
          lessons={lessons}
          initialPermissions={initialPermissions}
          onApply={handleApply}
        />
      )}

      {isSaving && <p className="mt-4 text-orange-300">Saving...</p>}
    </div>
  );
}
