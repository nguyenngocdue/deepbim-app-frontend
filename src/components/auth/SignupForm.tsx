import React from "react";
import SocialLogin from "./SocialLogin";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SignupForm: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

      <form className="space-y-4">
        <Input type="text" label="Full Name" placeholder="Enter your full name" required />
        <Input type="email" label="Email Address" placeholder="Enter your email" required />
        <Input type="password" label="Password" placeholder="••••••••" required />
        <Input type="password" label="Confirm Password" placeholder="••••••••" required />

        <Button className="w-full">Sign Up</Button>
      </form>

      <SocialLogin />

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 font-semibold">Sign In</a>
        </span>
      </div>
    </div>
  );
};

export default SignupForm;
