// src/components/PrivateRoute.tsx
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { LoginDialog } from "@/components/LoginDialog"

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLogin(true)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <>
        <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
      </>
    )
  }

  return children
}
