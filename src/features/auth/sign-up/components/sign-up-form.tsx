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
import { useGoogleLoginHandler } from '@/hooks/useGoogleLogin'
import { GitHubLoginButton } from '@/components/GitHubLoginButton'
import { GoogleLoginButton } from '@/components/GoogleLoginButton'
import { Loader2 } from 'lucide-react'
import AppButton from '@/components/bim-viewer/common/AppButton'
import { CLASS_NAME_DEFAULT } from '@/utils/class'
import { createNewUser } from '@/apis/users/UserSettings'
import { useGitHubLoginHandler } from '@/hooks/useGiiHubLogin'
import { toast } from 'sonner'

const formSchema = z
  .object({
    user_name: z
      .string()
      .min(3, { message: 'user_name must be at least 3 characters' })
      .max(20, { message: 'user_name must be less than 20 characters' }),
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
  const [isLoadingCreator, setIsLoadingCreator] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoadingCreator(true)
    try {
      const response = await createNewUser(data)
      // save email into localStorage
      localStorage.setItem("signup_email", data.email)
      navigate({ to: '/sign-in' })
      toast.success('Please check your email to verify your account.')
    } catch (error: any) {
      const apiErrors = error.response?.data?.errors

      if (apiErrors && typeof apiErrors === 'object') {
        Object.keys(apiErrors).forEach((key) => {
          if (form.getValues().hasOwnProperty(key)) {
            form.setError(key as any, { message: apiErrors[key] })
          }
        })
      } else if (error.message) {
        form.setError('email', {
          type: 'server',
          message: error.message,
        })
      } else {
        alert('Signup failed! Please try again.')
      }
    } finally {
      setIsLoadingCreator(false)
    }
  }

  const { isLoading: isLoadingGoogle, handleGoogleLogin } = useGoogleLoginHandler()
  const { isLoading: isLoadingGitHub, handleGitHubLogin } = useGitHubLoginHandler()

  return (
    <div className={cn(
      'grid gap-6 pt-2 text-gray-800 dark:text-slate-300',
      className
    )} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="text-left">
          <div className="grid gap-4">
            {/* Username */}
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-slate-200">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      className="bg-white dark:bg-[#161B22] border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700 dark:text-slate-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="bg-white dark:bg-[#161B22] border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700 dark:text-slate-200">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      className="bg-white dark:bg-[#161B22] border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700 dark:text-slate-200">Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      className="bg-white dark:bg-[#161B22] border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100"
                      {...field}
                    />
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
                <span className="w-full border-t border-gray-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#0d1117] px-2 text-gray-500 dark:text-slate-500">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GitHubLoginButton isLoading={isLoadingGitHub} onClick={handleGitHubLogin} />
              <div className="w-full flex items-center justify-center overflow-hidden">
                  <GoogleLoginButton isLoading={isLoadingGoogle} onClick={handleGoogleLogin} />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>

  )
}
