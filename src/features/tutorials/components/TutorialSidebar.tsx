import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, Book, Users, Settings, LogOut } from "lucide-react";

export function TutorialSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarTrigger />
        <SidebarContent>
          <div className="p-2">
            <h2 className="text-xl font-bold mb-4">Tutorial Hub</h2>
            <div>
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Home className="mr-2 h-4 w-4" />
                Trang chủ
              </Button>
            </div>
            <div>
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Book className="mr-2 h-4 w-4" />
                Khóa học
              </Button>
            </div>
            <div>
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Users className="mr-2 h-4 w-4" />
                Cộng đồng
              </Button>
            </div>
            <div>
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </Button>
            </div>
            <div className="mt-auto">
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}