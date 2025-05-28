import { FiSearch } from "react-icons/fi";

export function FolderTreeHeader({ filter, onFilterChange }: { filter: string; onFilterChange: (v: string) => void; }) {
  return (
    <div className="p-3 border-b border-gray-700">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </span>
        <input
          type="text"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Search folders or files..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-accent border border-gray-500 text-50 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
