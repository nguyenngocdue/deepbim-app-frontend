// components/ui/LinkId.tsx

import { Link } from "@tanstack/react-router"
import clsx from "clsx"

interface LinkIdProps {
  id: string | number
  href: string
  tail?:string
  prefix?: string
  className?: string
  disabled?: boolean
}

export function LinkId({
  id,
  href,
  tail,
  prefix = "#",
  className = "",
  disabled = false
}: LinkIdProps) {
  const content = (
    <span
      className={clsx(
        "font-mono",
        disabled ? "text-muted-foreground cursor-default" : "text-blue-600 hover:underline",
        className
      )}
    >
      {prefix}{id}
    </span>
  )

  if (disabled) return content

  return (
    <Link to={`${href}/${id}${tail}`}>
      {content}
    </Link>
  )
}
