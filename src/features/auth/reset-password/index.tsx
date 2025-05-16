import { Card } from "@/components/ui/card";
import AuthLayout from "../auth-layout";
import { Link } from "@tanstack/react-router";
import ResetPasswordForm from "./components/reset-password-form";
import { Separator } from "@/components/ui/separator";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            Set New Password
          </h1>
          <p className='text-sm text-gray-800 dark:text-gray-200 '>
            Please enter your new password below.<br />
            Make sure it's strong and easy to remember.
          </p>
        </div>
        <Separator orientation='horizontal' className='bg-zinc-500'/>
        <ResetPasswordForm />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Already know your password?{" "}
          <Link
            to="/sign-in"
            className="text-gray-800 dark:text-gray-400 underline underline-offset-4 hover:text-blue-800"
          >
            Sign in
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  );
}
