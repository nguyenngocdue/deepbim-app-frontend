import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { PasswordInput } from '@/components/password-input'


const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = new URLSearchParams(router.state.location.search)
  const token = searchParams.get('token') || undefined

  if (!token) {
    router.navigate({ to: '/sign-in' });
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!token) {
      toast.error('Invalid or missing token')
      return
    }

    try {
      setIsLoading(true)

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: values.password, token }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Reset failed')
      }
      const { data } = await res.json() as { data: any };
      localStorage.setItem("signup_email", data.mail)   
      toast.success('Password reset successfully')
      setTimeout(() => {
        router.navigate({ to: '/sign-in' })
      }, 1500)
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-medium text-muted-foreground text-left block pt-4'>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" className="bg-[#161B22] border border-slate-600 text-slate-100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormControl>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium text-muted-foreground text-left block'>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" className="bg-[#161B22] border border-slate-600 text-slate-100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button
          className="mt-2 w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  )
}
