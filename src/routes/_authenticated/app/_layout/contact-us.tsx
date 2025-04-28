import ContactUsPage from '@/pages/ContactUsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/_layout/contact-us')({
  component: ContactUsPage,
})

