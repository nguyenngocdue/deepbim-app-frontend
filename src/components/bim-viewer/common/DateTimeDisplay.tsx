import { format } from "date-fns";

interface DateTimeDisplayProps {
  isoDate: string;
  formatString?: string;
  withTimeZone?: boolean;
}

export const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({
  isoDate,
  formatString = "yyyy-MM-dd HH:mm",
  withTimeZone = false,
}) => {
  if (!isoDate) return <span>-</span>;

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) return <span>Invalid date</span>;

  const formatted = format(date, formatString);

  return (
    <span className="text-200">
      {formatted}
      {withTimeZone && ` (${Intl.DateTimeFormat().resolvedOptions().timeZone})`}
    </span>
  );
};
