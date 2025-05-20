import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ShowInfoMenuItemProps {
  onClick?: () => void;
}

export const ShowInfoMenuItem: React.FC<ShowInfoMenuItemProps> = ({ onClick }) => (
  <DropdownMenuItem onClick={onClick}>
    Show information group
  </DropdownMenuItem>
);
