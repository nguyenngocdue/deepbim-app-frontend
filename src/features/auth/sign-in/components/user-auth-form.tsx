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

      // Kiểm tra xem token có tồn tại không trước khi lưu
      if (!result.access_token || !result.refresh_token) {
        throw new Error('Invalid response from server: Missing tokens');
      }

      // Lưu token vào localStorage
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);
      // Điều hướng đến trang chủ
      await navigate({ to: '/' });
    } catch (err) {
      console.error('Login error:', err); // Log lỗi để debug
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);

      // Hiển thị lỗi cụ thể cho từng trường nếu có
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
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled={isLoading}
              >
                <IconBrandGithub className="h-4 w-4" /> GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled={isLoading}
              >
                <FaGoogle className="h-4 w-4" /> Google
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                to="/sign-up"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}