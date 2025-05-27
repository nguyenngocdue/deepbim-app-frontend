import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Bell, Folder, Users, CheckCircle, AlertCircle, FileText, MessageSquare } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const progressTrendData = [
  { name: 'Week 1', Completed: 12 },
  { name: 'Week 2', Completed: 24 },
  { name: 'Week 3', Completed: 38 },
  { name: 'Week 4', Completed: 51 },
  { name: 'Week 5', Completed: 63 },
  { name: 'Week 6', Completed: 72 },
];

export default function SubProjectSmartOverview() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 space-y-4">
        <div className="text-xs text-muted-foreground mb-2">Project: GreenTech Hub</div>
        <div className="text-sm text-gray-700 font-semibold">Smart Overview</div>
        <nav className="space-y-3 text-sm mt-4">
          <div className="flex items-center justify-between text-gray-800 cursor-pointer">
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4" /> Files
            </span>
            <span className="text-xs bg-gray-200 px-2 rounded-full">68</span>
          </div>
          <div className="flex items-center justify-between text-gray-800 cursor-pointer">
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Team Chat
            </span>
            <span className="text-xs bg-gray-200 px-2 rounded-full">3</span>
          </div>
          <div className="flex items-center justify-between text-gray-800 cursor-pointer">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Issues
            </span>
            <span className="text-xs bg-red-200 text-red-800 px-2 rounded-full">5</span>
          </div>
          <div className="flex items-center justify-between text-gray-800 cursor-pointer">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> RFIs
            </span>
            <span className="text-xs bg-green-200 text-green-800 px-2 rounded-full">18</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800 cursor-pointer">
            <Users className="w-4 h-4" /> Team
          </div>
          <div className="flex items-center gap-2 text-gray-800 cursor-pointer">
            <Bell className="w-4 h-4" /> Notifications
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Smart Header */}
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

        {/* Live Smart Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Files Uploaded</p>
              <h2 className="text-xl font-bold">68</h2>
              <Progress value={80} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Open Issues</p>
              <h2 className="text-xl font-bold text-red-500">5</h2>
              <Progress value={40} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">RFIs Answered</p>
              <h2 className="text-xl font-bold text-green-600">18</h2>
              <Progress value={90} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Progress Over Time</p>
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
        </div>

        {/* Timeline / Activity Feed */}
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

        {/* Actionable Insight */}
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
      </main>
    </div>
  );
}