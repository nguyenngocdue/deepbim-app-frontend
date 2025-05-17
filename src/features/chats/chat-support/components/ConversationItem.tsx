import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";

type Props = {
  avatarUrl?: string;
  name: string;
  lastMessage: string;
  lastMessageIsYou?: boolean;
  lastTime: string;
  isActive?: boolean;
};

export function ConversationItem({
  avatarUrl,
  name,
  lastMessage,
  lastMessageIsYou,
  lastTime,
  isActive,
}: Props) {
  return (
    <Card
      className={`
        flex items-center px-4 py-3 gap-3 rounded-lg cursor-pointer select-none transition
        hover:bg-gray-50 hover:shadow-xs hover:scale-[1.01]
        ${isActive ? "bg-primary/5 border border-primary/50" : "border border-transparent"}
      `}
    >
      <div className="relative">
        <Avatar className="w-12 h-12 ring-1 ring-gray-200">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 rounded-full bg-white p-[2px] shadow-sm">
          <MessageCircle className="w-4 h-4 text-primary" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900 truncate">{name}</span>
          <span className="text-xs text-gray-400">{lastTime}</span>
        </div>
        <div className="text-sm text-gray-500 truncate leading-tight">
          {lastMessageIsYou && <span className="font-medium text-gray-400">You: </span>}
          <span>{lastMessage}</span>
        </div>
      </div>
    </Card>
  );
}
