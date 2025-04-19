import HowItWorkPage from '@/pages/HowItWorkPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/how-it-works')({
  component: HowItWorkPage,
})

