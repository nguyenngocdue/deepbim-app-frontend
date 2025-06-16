import React from "react";

interface BooleanDisplayProps {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export const BooleanDisplay: React.FC<BooleanDisplayProps> = ({
  value,
  trueLabel = "Yes",
  falseLabel = "No",
}) => {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        value
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
};
