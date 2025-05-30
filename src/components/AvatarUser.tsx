import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUserProps {
  name: string;             // tên hiển thị
  id?: number;
  img?: string;             // đường link ảnh đại diện
  size?: "sm" | "md" | "lg"; // kích thước avatar
  showName?: boolean;       // có hiển thị tên bên cạnh không
}

export function AvatarUser({ img, name, size = "md", showName = true, id='' }: AvatarUserProps) {
  const fallback = name ? name.charAt(0).toUpperCase() : "?";

  let avatarSize = "h-8 w-8"; // mặc định size md
  if (size === "sm") avatarSize = "h-4 w-4";
  if (size === "lg") avatarSize = "h-14 w-14";

  return (
    <div className="flex items-center gap-3" title={`Id: #${id}`}>
      <Avatar className={avatarSize}>
        <AvatarImage src={img} alt={name} />
        <AvatarFallback className="bg-muted text-primary font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-sm font-medium text-foreground italic">
          {name}
        </span>
      )}
    </div>
  );
}
