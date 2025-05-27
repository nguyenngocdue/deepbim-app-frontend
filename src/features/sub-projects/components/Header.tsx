import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback>SP</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">Interior Fit-Out</h1>
          <p className="text-sm text-muted-foreground">Discipline: Architecture • In Progress</p>
          <p className="text-xs text-muted-foreground">Start: Jan 2024 • End: June 2024</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Preview</Button>
        <Button>Edit</Button>
      </div>
    </div>
  );
}