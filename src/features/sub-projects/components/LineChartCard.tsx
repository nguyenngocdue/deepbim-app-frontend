import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const progressTrendData = [
  { name: 'Week 1', Completed: 12 },
  { name: 'Week 2', Completed: 24 },
  { name: 'Week 3', Completed: 38 },
  { name: 'Week 4', Completed: 51 },
  { name: 'Week 5', Completed: 63 },
  { name: 'Week 6', Completed: 72 },
];

export function LineChartCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-2">Progress Over Time</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Completed" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
