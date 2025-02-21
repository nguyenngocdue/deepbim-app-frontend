import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

const SocialLogin: React.FC = () => {
  return (
    <div className="mt-4">
      <div className="relative text-center my-4">
        <span className="text-gray-500 text-sm bg-white px-2">Or</span>
      </div>
      <Button variant="outline" className="w-full flex items-center justify-center">
        <FcGoogle className="mr-2 text-lg" /> Sign in with Google
      </Button>
    </div>
  );
};

export default SocialLogin;
