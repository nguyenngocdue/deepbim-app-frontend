import React from "react"

interface IdDisplayProps {
  id: string | number
  link?: string
  className?: string
}

export const IdDisplay: React.FC<IdDisplayProps> = ({ id, link, className }) => {
  if (!id) return null

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-blue-600 underline hover:text-blue-800 ${className || ""}`}
        title={`Go to detail of ${id}`}
      >
        #{id}
      </a>
    )
  }

  return (
    <span className={className}>{id}</span>
  )
}
