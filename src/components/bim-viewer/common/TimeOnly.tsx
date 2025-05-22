
interface TimeOnlyProps {
  isoString: string;
  className?: string;
}

export function TimeOnly({ isoString, className }: TimeOnlyProps) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <span className={`${className} text-zinc-500`}>
      {hours}:{minutes}
    </span>
  );
}

