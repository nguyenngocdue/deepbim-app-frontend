import SocialLogin from "@/components/auth/SocialLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";


const LoginForm: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

      <form className="space-y-4">
        <Input type="email" label="Email" placeholder="Nhập email của bạn" required />
        <Input type="password" label="Mật khẩu" placeholder="••••••••" required />
        <Button className="w-full">Đăng nhập</Button>
      </form>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">Chưa có tài khoản? <a href="#" className="text-blue-500">Đăng ký</a></span>
      </div>

      <SocialLogin />
    </div>
  );
};

export default LoginForm;
