import { Loader2 } from "lucide-react";

export function LoadingState({ message = "loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground ">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span>{message}</span>
    </div>
  );
}

