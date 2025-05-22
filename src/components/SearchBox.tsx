import React from "react";
import { Input } from "@/components/ui/input";
import { BsFillSearchHeartFill } from "react-icons/bs";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  inputClassName?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  inputClassName = "",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <span className="absolute left-3 text-gray-400 pointer-events-none">
        <BsFillSearchHeartFill aria-hidden="true" />
      </span>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`pl-10 pr-3 text-gray-700 dark:text-gray-200 ${inputClassName}`}
      />
    </div>
  );
};
