"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { apiGet } from "@/api";
import { Model, ModelTable } from "./ModelTable";

export default function MediaPage() {
  const [data, setData] = useState<Model[]>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      const userId = currentUser.id;
      const response = await apiGet<{ data: any[] }>(`/media/user/${userId}`);
      const userData = await apiGet<{ [x: string]: any; data: any[] }>(`/users/${userId}`);

      const formatted: Model[] = response.data.map((item) => ({
        name: item.filename,
        status: item.isPublic ? "Public" : "Private",
        uploader: {
          email: userData?.email || "unknown",
          avatar: userData?.picture || "https://i.pravatar.cc/40",
        },
        modified: new Date(item.updatedAt).toLocaleDateString("en-GB"),
      }));
      setData(formatted);
    };

    fetchData();
  }, [currentUser]);

console.log(data);

  return (
    <div className="p-4">
      <ModelTable data={data} />
    </div>
  );
}
