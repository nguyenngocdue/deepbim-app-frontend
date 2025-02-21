import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { Card } from "@/components/ui/card";

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <LoginForm />
      </Card>
    </div>
  );
};

export default Login;
