import React from "react";

interface PriceDisplayProps {
  price: number;
  currency?: string; // default: VND
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  currency = "VND",
}) => {
  const format = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <span className="text-base font-medium text-gray-900 dark:text-white">
      {format(price)}
    </span>
  );
};
