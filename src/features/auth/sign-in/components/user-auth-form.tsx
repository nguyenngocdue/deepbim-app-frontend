import { HTMLAttributes, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from '@tanstack/react-router';
import { IconBrandGithub } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import { FaGoogle } from 'react-icons/fa';

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(7, { message: 'Password must be at least 7 characters long' }),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { navigate } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const result = await response.json();

      if (!result.access_token || !result.refresh_token) {
        throw new Error('Invalid response from server: Missing tokens');
      }

      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);
      await navigate({ to: '/' });
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);

      if (errorMessage.toLowerCase().includes('email')) {
        form.setError('email', { message: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password')) {
        form.setError('password', { message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('grid gap-8', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {/* Tích hợp h1 và p */}
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Login
              </h1>
              <p className="text-sm text-gray-300">
                Enter your email and password below <br />
                to log into your account
              </p>
            </div>

            {/* Hiển thị lỗi */}
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Trường Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-white font-medium text-left block">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="rounded-lg border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Trường Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-white font-medium text-left block">
                      Password
                    </FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      className="rounded-lg border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Nút Login */}
            <Button
              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            {/* Phân cách "Or continue with" */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-4 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Nút GitHub và Google */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="w-full rounded-lg border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                type="button"
                disabled={isLoading}
              >
                <IconBrandGithub className="h-5 w-5 mr-2" /> GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-lg border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                type="button"
                disabled={isLoading}
              >
                <FaGoogle className="h-5 w-5 mr-2" /> Google
              </Button>
            </div>

            {/* Liên kết Sign Up */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}