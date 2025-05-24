import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { apiGet, fetchNoSignAPI } from "@/api";
import { Model, ModelTable } from "@/components/common/ModelTable";
import { modelColumnsConfig } from "../../ColumnsConfig";

interface AppMediaPageProps {
  hasAction?: boolean;
}

export default function AppMediaPage({ hasAction = true }: AppMediaPageProps) {
  const [data, setData] = useState<Model[]>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Hàm fetchData tách riêng và dùng useCallback để tránh tạo mới mỗi render
  const fetchData = useCallback(async () => {

    try {
      const mediaData = await fetchNoSignAPI<{ data: any[] }>(`/media/guest`);
      const mediaList = mediaData.data;
      if(mediaList.length < 1) return;
      const formatted: Model[] = mediaList
        .filter((item) => item.deletedBy === null) // ✅ Chỉ lấy những cái chưa bị xóa mềm
        .map((item) => ({
          id: item.id,
          name: item.file_name,
          viewId: item.view_id,
          status: item.is_public ? "Public" : "Private",
          size: item.size * 1 / (1024 * 1024),
          uploader: {
            email: "duengocnguyen@gmail.com",
            avatar: "https://lh3.googleusercontent.com/a/ACg8ocKi6JqRVGqhLlyiqQ99c9P44TF7vfWXUZeLJS0x2xbur9HAJDA=s96-c",
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
      <ModelTable
        data={data}
        refeshData={fetchData}
        hasAction={hasAction}
        actionTypes={["View"]}
        columnsConfig={modelColumnsConfig}
      />

    </div>
  );
}
