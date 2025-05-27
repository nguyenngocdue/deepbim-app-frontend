import { Card, CardContent } from "@/components/ui/card";

export function ActivityFeed() {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold">Recent Activity</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>📄 File <strong>A1.1</strong> uploaded by Liam – 2 days ago</li>
          <li>🛠️ Issue <strong>#102</strong> resolved by Ella – 3 days ago</li>
          <li>📥 Submittal <strong>#22</strong> reviewed by Henry – last week</li>
        </ul>
      </CardContent>
    </Card>
  );
}
