import React from "react";
import LoginForm from "../components/auth/LoginForm";
import loginIllustration from "../assets/login-background.svg"; // Your image here

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Column - Welcome Message */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white px-10">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold">Welcome back!</h1>
          <p className="text-lg mt-2">You can sign in to access your existing account.</p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
