import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  inputClassName?: string;
  buttonClassName?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  buttonText,
  buttonIcon = "🔍",
  inputClassName = "",
  buttonClassName = "",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-72 text-gray-700 dark:text-gray-200 ${inputClassName}`}
      />
      <Button
        type="button"
        variant="outline"
        onClick={onSearch}
        className={buttonClassName}
      >
        {buttonIcon}
        {buttonText && <span className="ml-1">{buttonText}</span>}
      </Button>
    </div>
  );
};
