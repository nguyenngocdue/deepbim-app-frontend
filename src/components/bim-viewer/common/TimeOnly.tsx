export function TimeOnly({ isoString , className}: { isoString: string, className:string }) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <span className={className}>
      {hours}:{minutes}
    </span>
  );
}

