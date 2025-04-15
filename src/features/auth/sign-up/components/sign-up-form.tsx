import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { IconBrandGithub } from '@tabler/icons-react'
import { FaGoogle } from 'react-icons/fa'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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

type SignUpFormProps = HTMLAttributes<HTMLDivElement>

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

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const payload = new URLSearchParams({
        email: data.email,
        username: data.username,
        password: data.password,
      })

      const response = await api.post('/users/create', payload)
      console.log('User created ✅:', response.data)
      navigate({ to: '/sign-in' })
    } catch (error: any) {
      const message = error.response?.data?.message
      const apiErrors = error.response?.data?.errors

      if (apiErrors && typeof apiErrors === 'object') {
        for (const key in apiErrors) {
          if (form.getValues().hasOwnProperty(key)) {
            form.setError(key as typeof formSchema.shape, {
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
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6 text-slate-300', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="text-left">
          <div className='grid gap-4'>

            {/* Username */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='text-left'>
                  <FormLabel className='text-sm text-left'>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='username'
                      className='bg-[#161B22] border border-slate-600 text-slate-100 focus-visible:ring-indigo-500'
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
              name='email'
              render={({ field }) => (
                <FormItem className='text-left'>
                  <FormLabel className='text-sm text-left'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='name@example.com'
                      className='bg-[#161B22] border border-slate-600 text-slate-100 focus-visible:ring-indigo-500'
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
              name='password'
              render={({ field }) => (
                <FormItem className='text-left'>
                  <FormLabel className='text-sm text-left'>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='********'
                      className='bg-[#161B22] border border-slate-600 text-slate-100 focus-visible:ring-indigo-500'
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
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='text-left'>
                  <FormLabel className='text-sm text-left'>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='********'
                      className='bg-[#161B22] border border-slate-600 text-slate-100 focus-visible:ring-indigo-500'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className='mt-2 w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90'
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>

            {/* Social login divider */}
            <div className='relative my-4'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-slate-700' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-[#0d1117] px-2 text-slate-500'>
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full border-slate-600 bg-[#161B22] text-slate-100 hover:bg-slate-800'
                type='button'
                disabled={isLoading}
              >
                <IconBrandGithub className='h-4 w-4' /> GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full border-slate-600 bg-[#161B22] text-slate-100 hover:bg-slate-800'
                type='button'
                disabled={isLoading}
              >
                <FaGoogle className='h-4 w-4' /> Google
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
