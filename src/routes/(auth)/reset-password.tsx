import ResetPasswordPage from '@/features/auth/reset-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordPage,
})

