import { Mail, Phone, Facebook } from "lucide-react";

export default function TutorialHeader() {
  return (
  <header className="w-full bg-black text-white text-xs md:text-sm px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-green-400" />
              <span>+84 398 422 988</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} className="text-blue-400" />
              <span>Gmail</span>
            </div>
            <div className="flex items-center gap-1">
              <Facebook size={14} className="text-blue-500" />
              <span>Facebook</span>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="cursor-pointer hover:underline hover:text-green-400">Đăng ký</span>
            <span className="cursor-pointer hover:underline hover:text-blue-400">Đăng nhập</span>
          </div>
        </div>
      </header>
  );
}