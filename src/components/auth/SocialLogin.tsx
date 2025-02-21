import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

const SocialLogin: React.FC = () => {
  return (
    <div className="mt-4">
      <div className="relative text-center my-4">
        <span className="text-gray-500 text-sm bg-white px-2">Hoặc</span>
      </div>
      <Button variant="outline" className="w-full flex items-center justify-center">
        <FcGoogle className="mr-2 text-lg" /> Đăng nhập với Google
      </Button>
    </div>
  );
};

export default SocialLogin;
