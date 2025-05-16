import { VerifyEmailPage } from '@/features/auth/verify-mail/VerifyEmailPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/verify-email')({
  component: VerifyEmailPage,
})

