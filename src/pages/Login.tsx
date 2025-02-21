import React from "react";
import LoginForm from "../components/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Column - New Teal Green Gradient */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-r from-green-300 to-teal-500 text-white px-10">
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
