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
  variant?: "link" | "outline" | "default" | "destructive" | "secondary" | "ghost" | null | undefined;
  onClick?: (e: React.MouseEvent) => void; // ✅ thêm onClick chuẩn
  icon?: React.ReactNode;
}

const AppButton: React.FC<AppButtonProps> = ({
  isLoading = false,
  trueName = "Loading...",
  falseName = "Submit",
  className = "",
  loadingIcon,
  defaultIcon,
  href,
  variant = "default",
  onClick,
  icon,
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
        className={`transition-all duration-200 font-semibold rounded-xl shadow-md hover:shadow-lg`}
        {...(props as any)}
      >
        {content}
      </Link>
    );
  }

  // Ngược lại render Button
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={`transition-all duration-200 font-semibold shadow-md hover:bg-primary/90  ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {icon}
      {content}
    </Button>
  );
};

export default AppButton;
