import { AuthCallback2 } from '@/components/auth/AuthCallback2'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/callback')({
  component: AuthCallback2,
})

