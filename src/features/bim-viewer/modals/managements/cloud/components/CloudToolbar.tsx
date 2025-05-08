import { useState } from "react";
import { FaSearch, FaFolderPlus } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { HiViewList, HiViewGrid } from "react-icons/hi";

const CloudToolbar = () => {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded shadow-sm text-sm text-gray-700">
      {/* Sort Dropdown */}
      <select className="border rounded px-3 py-1 hover:border-gray-400">
        <option>Mới nhất</option>
        <option>Cũ nhất</option>
        <option>Tên A-Z</option>
      </select>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Tìm kiếm ..."
        className="border rounded px-3 py-1 w-60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Date Picker Placeholder */}
      <button className="flex items-center gap-1 px-3 py-1 border rounded hover:border-gray-400">
        <MdCalendarToday className="text-gray-500" />
        Ngày
      </button>

      {/* Filter Dropdown */}
      <select className="border rounded px-3 py-1 hover:border-gray-400">
        <option>Tất cả</option>
        <option>PDF</option>
        <option>Ảnh</option>
        <option>Video</option>
      </select>

      {/* Search Button */}
      <button className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">
        <FaSearch />
        Tìm Kiếm
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Create Folder Button */}
      <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded">
        <FaFolderPlus />
        Tạo Thư Mục
      </button>

      {/* View Toggle */}
      <div className="flex gap-1 border rounded p-1 ml-2">
        <button
          onClick={() => setView("list")}
          className={`p-1 rounded ${view === "list" ? "bg-green-100 text-green-700" : "text-gray-500"}`}
        >
          <HiViewList size={18} />
        </button>
        <button
          onClick={() => setView("grid")}
          className={`p-1 rounded ${view === "grid" ? "bg-green-100 text-green-700" : "text-gray-500"}`}
        >
          <HiViewGrid size={18} />
        </button>
      </div>
    </div>
  );
};

export default CloudToolbar;
