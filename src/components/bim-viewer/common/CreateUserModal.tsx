import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { DialogTemplate } from '@/components/model-table/DialogTemplate'

const formSchema = z
  .object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(7, { message: 'Password must be at least 7 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: { user_name: string; email: string; password: string }) => Promise<void>
}

export function CreateUserModal({ open, onClose, onSave }: CreateUserModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

const handleSubmit = async (data: z.infer<typeof formSchema>) => {
  try {
    await onSave({
      user_name: data.username,
      email: data.email,
      password: data.password,
    })
    toast.success('User created successfully')
    onClose()
  } catch (error: any) {
    if (error.message) {
      // 👇 Ném luôn vào email
      form.setError('email', {
        type: 'server',
        message: error.message,
      })
    } else {
      toast.error('Unknown error occurred')
    }
  }
}




  return (
    <DialogTemplate
      open={open}
      onClose={onClose}
      title="Create New User"
      description="Fill out the form to create a new user."
      disableOutsideClose={form.formState.isSubmitting}
      className="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} type="button" disabled={form.formState.isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="create-user-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form id="create-user-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-left">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DialogTemplate>
  )
}
