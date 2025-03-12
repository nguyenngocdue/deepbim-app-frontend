import Home from '@/pages/bim-viewer/Home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/apps/home')({
  component: Home,
})

