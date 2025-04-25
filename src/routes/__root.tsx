// src/routes/__root/route.ts
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { fetchCurrentUser } from '@/store/slices/AuthSlice'

function RootLayout() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [])

  return (
    <>
      <Outlet />
      {import.meta.env.MODE === 'beta' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  )
}

// 👇 Export theo chuẩn của tanstack-router
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootLayout,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
