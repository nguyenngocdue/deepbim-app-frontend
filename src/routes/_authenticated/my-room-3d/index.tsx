import MyRoom3D from '@/features/my-room-3d'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/my-room-3d/')({
  component: MyRoom3D,
})
