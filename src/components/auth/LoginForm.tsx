import React from "react";
import SocialLogin from "./SocialLogin";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const LoginForm: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

      <form className="space-y-4">
        <Input type="email" label="Username or email" icon="email" placeholder="Enter your email" required />
        <Input type="password" label="Password" icon="password" placeholder="••••••••" required />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-blue-600" />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>

        <Button className="w-full">Sign In</Button>
      </form>

      <SocialLogin />

      {/* Navigation link to Sign-Up */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          New here?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Create An Account
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
