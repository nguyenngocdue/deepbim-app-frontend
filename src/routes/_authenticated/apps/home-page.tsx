import HomePage from '@/pages/HomePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/apps/home-page')({
  component: HomePage,
})


