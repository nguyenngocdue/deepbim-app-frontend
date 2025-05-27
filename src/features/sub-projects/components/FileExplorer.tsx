// features/subProject/components/FileExplorer.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Folder, FileText } from "lucide-react";

const files = [
  { name: "MEP_Plan_v4.ifc", type: "IFC", updated: "2 days ago" },
  { name: "Structural_Model.rvt", type: "RVT", updated: "4 days ago" },
  { name: "HVAC_Layout.dwg", type: "DWG", updated: "last week" },
];

export default function FileExplorer() {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Files</h2>
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded px-3 py-2 text-sm hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>{file.name}</span>
              </div>
              <div className="text-muted-foreground text-xs">{file.updated}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
