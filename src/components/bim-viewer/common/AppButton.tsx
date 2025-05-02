import React from "react";
import { Link } from "@tanstack/react-router"; 
import { Button } from "@/components/ui/button"; 

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  trueName?: string;
  falseName?: string;
  className?: string;
  loadingIcon?: React.ReactNode;
  defaultIcon?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void; // ✅ thêm onClick chuẩn
}

const AppButton: React.FC<AppButtonProps> = ({
  isLoading = false,
  trueName = "Loading...",
  falseName = "Submit",
  className = "",
  loadingIcon,
  defaultIcon,
  href,
  onClick,
  ...props
}) => {
  const content = (
    <span className="inline-flex items-center gap-2  font-heading">
      {isLoading ? loadingIcon : defaultIcon}
      {isLoading ? trueName : falseName}
    </span>
  );

  if (href) {
    // Nếu có href ➔ render Link
    return (
      <Link
        to={href}
        className={`transition-all duration-200 font-semibold rounded-xl shadow-md hover:shadow-lg ${className}`}
        {...(props as any)}
      >
        {content}
      </Link>
    );
  }

  // Ngược lại render Button
  return (
    <Button
      variant='ghost'
      onClick={onClick}
      className={`transition-all duration-200 font-semibold shadow-md hover:shadow-lg  ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {content}
    </Button>
  );
};

export default AppButton;
