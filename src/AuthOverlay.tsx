import { useEffect, useState } from 'react'
import { PromptCard } from '@/features/learning/lessons-for-newbie/components/PromptCard'
import AppButton2 from '@/components/bim-viewer/common/AppButton2'
import { useLocation } from '@tanstack/react-router'

const excludedPaths = [
  '/',
  '/sign-in',
  '/app',
  '/app/connectors',
  '/app/features',
  '/app/how-it-works',
  '/tutorials/home-page',
  '/coming-soon'
]

export function AuthOverlay() {
  const [show, setShow] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // ✅ Luôn gọi hook đầu tiên
  const location = useLocation()
  const pathname = location.pathname

  // ✅ Đảm bảo chỉ chạy khi client render xong
  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const token = localStorage.getItem('access_token')
    const isExcluded = excludedPaths.some((path) =>
      pathname.startsWith(path)
    )

    if (!token && !isExcluded) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [pathname, hydrated])

  if (!hydrated || !show) return null

  const currentUrl = pathname + location.search

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <PromptCard
        title="Login Required"
        description="Please log in to continue."
        imageUrl="https://minio.deepbim.net:9000/deepbim-fe/1750073553293-login.gif"
        action={
          <AppButton2
            btnType="move"
            isLoading={false}
            onClick={() => {
              window.location.href = `/sign-in?redirect=${encodeURIComponent(currentUrl)}`
            }}
            falseName="Log In Now"
          />
        }
      />
    </div>
  )
}
