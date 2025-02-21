import React from "react";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ForgotPasswordForm: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password?</h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form className="space-y-4">
        <Input type="email" label="Email Address" placeholder="Enter your email" required />
        <Button className="w-full">Send Reset Link</Button>
      </form>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          Remember your password?{" "}
          <Link to="/signin" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
