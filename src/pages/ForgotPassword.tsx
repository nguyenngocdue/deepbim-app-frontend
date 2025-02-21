import React from "react";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

const ForgotPassword: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Column - Gradient Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-r from-green-300 to-teal-500 text-white px-10 py-16 md:py-0">
        <div className="max-w-md text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Forgot your password?</h1>
          <p className="text-lg md:text-xl font-medium whitespace-nowrap">
            No worries, we got you covered!
          </p>
        </div>
      </div>

      {/* Right Column - Forgot Password Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
