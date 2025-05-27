// features/subProject/components/IssueList.tsx

import { Card, CardContent } from "@/components/ui/card";

const issues = [
  { id: 101, title: "Clash between duct and beam", status: "Open", assignedTo: "Ella" },
  { id: 102, title: "Missing IFC for level 4", status: "Resolved", assignedTo: "Liam" },
  { id: 103, title: "Overlapping gridlines", status: "Open", assignedTo: "Henry" },
];

export default function IssueList() {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Issue Tracker</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b">
            <tr>
              <th className="py-2">ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b last:border-none">
                <td className="py-2 text-muted-foreground">#{issue.id}</td>
                <td>{issue.title}</td>
                <td>
                  <span className={`text-xs px-2 py-1 rounded-full ${issue.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {issue.status}
                  </span>
                </td>
                <td>{issue.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}