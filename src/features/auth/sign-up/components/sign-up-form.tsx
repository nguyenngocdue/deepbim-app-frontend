import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'


import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { useNavigate } from '@tanstack/react-router'
import api from '@/lib/AxiosInstance'
import { useGoogleLoginHandler } from '@/hooks/useGoogleLogin'
import { useGitHubLoginHandler } from '@/hooks/useGiiHubLogin'
import { GitHubLoginButton } from '@/components/GitHubLoginButton'
import { GoogleLoginButton } from '@/components/GoogleLoginButton'
import { Loader2 } from 'lucide-react'
import AppButton from '@/components/bim-viewer/common/AppButton'
import { CLASS_NAME_DEFAULT } from '@/utils/class'
import { createNewUser } from '@/apis/users/UserSettings'


const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(20, { message: 'Username must be less than 20 characters' }),
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, { message: 'Please enter your password' })
      .min(7, { message: 'Password must be at least 7 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoadingCreator(true);
    const response = await createNewUser(data)
    try {
      console.log('User created ✅:', response.data)
      navigate({ to: '/sign-in' })
    } catch (error: any) {
      const message = error.response?.data?.message
      const apiErrors = error.response?.data?.errors

      if (apiErrors && typeof apiErrors === 'object') {
        for (const key in apiErrors) {
          if (form.getValues().hasOwnProperty(key)) {
            form.setError(key as 'username' | 'email' | 'password' | 'confirmPassword', {
              message: apiErrors[key],
            })
          }
        }
      } else if (message) {
        if (message.toLowerCase().includes('email')) {
          form.setError('email', { message })
        } else if (message.toLowerCase().includes('username')) {
          form.setError('username', { message })
        } else if (message.toLowerCase().includes('password')) {
          form.setError('password', { message })
        } else {
          form.setError('confirmPassword', { message })
        }
      } else {
        alert('Signup failed! Please try again.')
      }
    } finally {
      setIsLoadingCreator(false)
    }
  }

  const { isLoading, error, handleGoogleLogin } = useGoogleLoginHandler();
  const { isLoadingGitHub, errorGitHub, handleGitHubLogin } = useGitHubLoginHandler();

  if (error) {
    console.log(error);
  }

  return (
    <div className={cn('grid gap-6 pt-2 text-slate-300', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="text-left">
          <div className="grid gap-4">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" className="bg-[#161B22] border border-slate-600 text-slate-100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" className="bg-[#161B22] border border-slate-600 text-slate-100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" className="bg-[#161B22] border border-slate-600 text-slate-100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" className="bg-[#161B22] border border-slate-600 text-slate-100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AppButton
              isLoading={isLoadingCreator}
              trueName="Creating..."
              falseName="Create Account"
              loadingIcon={<Loader2 className="w-4 h-4 animate-spin" />}
              className={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON}
            />


            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0d1117] px-2 text-slate-500">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <GitHubLoginButton isLoading={isLoadingGitHub} onClick={handleGitHubLogin} />
              <GoogleLoginButton/>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}