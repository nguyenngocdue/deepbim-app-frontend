import React from "react";
import LoginForm from "../components/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Column - Gradient Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-r from-green-300 to-teal-500 text-white px-10 py-16 md:py-0">
        <div className="max-w-md text-center">
          {/* Responsive Text */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Welcome back!</h1>
          <p className="text-lg md:text-xl font-medium whitespace-nowrap">
            You can sign in to access your existing account.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
