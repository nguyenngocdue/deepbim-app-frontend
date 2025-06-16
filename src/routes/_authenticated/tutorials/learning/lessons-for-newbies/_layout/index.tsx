import LessonForNewbies from '@/features/learning/lessons-for-newbie/LessonForNewbies'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/tutorials/learning/lessons-for-newbies/_layout/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <LessonForNewbies/>
    </>
  )
}
