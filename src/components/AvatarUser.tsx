import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUserProps {
  name: string;
  email?: string;
  id?: number;
  img?: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function AvatarUser({
  img,
  name,
  email,
  size = "md",
  showName = true,
  id = "",
}: AvatarUserProps) {
  const fallback = name ? name.charAt(0).toUpperCase() : "?";

  let avatarSize = "h-8 w-8";
  if (size === "sm") avatarSize = "h-4 w-4";
  if (size === "lg") avatarSize = "h-14 w-14";

  return (
    <div className="flex items-center gap-2" title={`Id: #${id}`}>
      <Avatar className={`${avatarSize} bg-gray-200 dark:bg-slate-600`}>
        <AvatarImage src={img} alt={name} />
        <AvatarFallback className="bg-muted text-primary font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>

      {showName && (
        <div className="text-sm leading-tight text-start">
          <div className="font-medium text-foreground italic border-b dark:border-gray-700 border-gray-400 ">{name}</div>
          {email && (
            <div className="text-xs text-muted-foreground">{email}</div>
          )}
        </div>
      )}
    </div>
  );
}
