import WelcomeUpload from '@/features/bim-viewer/upload/WelcomeUpload'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/upload/')({
  component: WelcomeUpload,
})

