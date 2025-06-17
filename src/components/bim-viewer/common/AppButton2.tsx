import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { renderIcon } from "@/components/model-table/IconType";
import { cn } from "@/lib/utils";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  trueName?: string;
  falseName?: string;
  className?: string;
  loadingIcon?: React.ReactNode;
  defaultIcon?: React.ReactNode;
  href?: string;
  variant?: "link" | "outline" | "default" | "destructive" | "secondary" | "ghost" | null | undefined;
  onClick?: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  btnType?: string;
}

type ButtonType = "delete" | "create" | "update" | "cancel" | "edit" | "move" | "view";

const buttonTypeStyles: Record<ButtonType, string> = {
  delete: "bg-red-600 dark:bg-red-800 hover:bg-red-700 dark:hover:bg-red-700 text-white dark:text-slate-200",
  create: "bg-indigo-600 dark:bg-indigo-600 hover:bg-green-700 dark:hover:bg-green-700 text-white dark:text-slate-200",
  update: "bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-700 text-white dark:text-slate-200",
  cancel: "bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600 text-white dark:text-slate-200",
  edit: "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-500 text-white dark:text-slate-200",
  move: "bg-cyan-600 dark:bg-cyan-800 hover:bg-cyan-700 dark:hover:bg-cyan-700 text-white dark:text-slate-200",
  view: "bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white dark:text-slate-200",
};

const AppButton2: React.FC<AppButtonProps> = ({
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
  btnType,
  ...props
}) => {
  const styleByType =
    btnType && (["delete", "create", "update", "cancel", "edit", "move", "view"] as const).includes(btnType as ButtonType)
      ? buttonTypeStyles[btnType as ButtonType]
      : "";
  const autoIcon = icon ?? renderIcon((btnType && (["delete", "create", "update", "cancel", "edit", "move", "view"] as const).includes(btnType as ButtonType) ? btnType : "create") as ButtonType);

  const content = (
    <span className="inline-flex items-center gap-2 font-heading">
      {isLoading ? loadingIcon : autoIcon}
      {isLoading ? trueName : falseName}
    </span>
  );

  if (href) {
    return (
      <Link
        to={href}
        className={cn(
          "transition-all duration-200 font-semibold rounded-xl shadow-md hover:shadow-lg px-4 py-2 text-sm",
          styleByType,
          className
        )}
        {...(props as any)}
      >
        {content}
      </Link>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "transition-all duration-200 font-semibold shadow-md px-4 py-2 text-sm z-50",
        styleByType,
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {content}
    </Button>
  );
};

export default AppButton2;
