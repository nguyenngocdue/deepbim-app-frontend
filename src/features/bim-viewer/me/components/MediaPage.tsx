import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { apiGet } from "@/api";
import { Model, ModelTable } from "./ModelTable";

export default function MediaPage() {
  const [data, setData] = useState<Model[]>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Hàm fetchData tách riêng và dùng useCallback để tránh tạo mới mỗi render
  const fetchData = useCallback(async () => {
    if (!currentUser) return;

    try {
      const userId = currentUser.id;

      // Fetch media list
      const [mediaResponse, userResponse] = await Promise.all([
        apiGet<{ data: any[] }>(`/media/user/${userId}`),
        apiGet<{ data: any }>(`/users/${userId}`),
      ]);

      const mediaList = mediaResponse.data;
      const userData = userResponse.data;

      const formatted: Model[] = mediaList
        .filter((item) => item.deletedBy === null) // ✅ Chỉ lấy những cái chưa bị xóa mềm
        .map((item) => ({
          id: item.id,
          name: item.filename,
          status: item.isPublic ? "Public" : "Private",
          uploader: {
            email: userData?.email || "Unknown",
            avatar: userData?.picture || "",
          },
          modified: new Date(item.updatedAt).toLocaleDateString("en-GB"),
        }));

      setData(formatted);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [currentUser]);

  // Fetch khi load trang và mỗi khi currentUser thay đổi
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-4">
      <ModelTable data={data} onDeleteSuccess={fetchData} />
    </div>
  );
}
