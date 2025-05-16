import { HTMLAttributes, useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from '@tanstack/react-router';
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
import { LogoWord } from '@/components/LogoWord';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginHandler } from '@/hooks/useGoogleLogin';
import { GitHubLoginButton } from '@/components/GitHubLoginButton';
import { useGitHubLoginHandler } from '@/hooks/useGiiHubLogin';
import { fetchUserProfile } from '@/api';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { Separator } from '@/components/ui/separator';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { setCurrentUser, UserProfile } from '@/store/slices/AuthSlice';
import AppButton from '@/components/bim-viewer/common/AppButton';
import { Loader2 } from 'lucide-react';
import { CLASS_NAME_DEFAULT } from '@/utils/class';

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
  const { navigate } = useRouter();
  const { isLoading, error, handleGoogleLogin } = useGoogleLoginHandler()
  const { isLoadingGitHub, errorGitHub, handleGitHubLogin } = useGitHubLoginHandler();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

   useEffect(() => {
    const email = localStorage.getItem('signup_email')
    if (email) {
      form.setValue('email', email)
      localStorage.removeItem('signup_email') // xoá luôn cho sạch
    }
  }, [form])

  async function onSubmit(data: z.infer<typeof formSchema>) {
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

      if (!result.data.access_token || !result.data.refresh_token) {
        throw new Error('Invalid response from server: Missing tokens');
      }


      localStorage.setItem('access_token', result.data.access_token);
      localStorage.setItem('refresh_token', result.data.refresh_token);

      const userData = await fetchUserProfile();

      if(userData.data.id) {
        dispatch(setCurrentUser(userData as UserProfile));
      }

      await navigate({ to: '/' });
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';

      if (errorMessage.toLowerCase().includes('email')) {
        form.setError('email', { message: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password')) {
        form.setError('password', { message: errorMessage });
      }
    } finally {
    }
  }

  return (
    <div className={cn('grid gap-8 h-svh bg-behind w-full p-4 z-50 bg-transparent', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {/* Tích hợp h1 và p */}
            <div className="flex flex-col space-y-2 text-left">
              <div className='m-auto pb-2 hidden'>
                <LogoWord />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-50">
                Sign in
              </h1>
              <p className="text-sm text-muted-foreground">
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
           <Separator orientation='horizontal' className='bg-zinc-500'/>
            {/* Trường Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className=" font-medium text-left block text-muted-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="text-sm text-reverse rounded-lg border-gray-600   placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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
                    <FormLabel className=" font-medium text-left block text-muted-foreground ">
                      Password
                    </FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm  hover:text-blue-400 transition-colors duration-200 text-muted-foreground"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      className="rounded-lg text-reverse border-gray-600  placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />


            <AppButton
              isLoading={isLoading}
              trueName="Sigining in..."
              falseName="Sign in"
              loadingIcon={<Loader2 className="w-4 h-4 animate-spin" />}
              className={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON}
            />


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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <GitHubLoginButton  isLoading={isLoadingGitHub} onClick={handleGitHubLogin}/>
              <GoogleLoginButton />
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