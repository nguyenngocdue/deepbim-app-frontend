import { Card, CardContent } from "@/components/ui/card";

export function ActionableItems() {
  return (
    <Card>
      <CardContent className="p-4 space-y-1">
        <h3 className="font-semibold mb-2">What needs your attention?</h3>
        <ul className="text-sm text-red-600 list-disc pl-5">
          <li>3 RFIs pending response over 7 days</li>
          <li>Issue #109 assigned to you</li>
          <li>File "MEP_Plan_v4.ifc" missing description</li>
        </ul>
      </CardContent>
    </Card>
  );
}