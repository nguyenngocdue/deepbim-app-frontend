// src/features/auth/useGoogleLogin.ts
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CredentialResponse } from '@react-oauth/google'

export function useGoogleLoginHandler() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true)
    setError('')
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const credential = credentialResponse?.credential

      if (!credential) {
        throw new Error('Google login failed: missing credential')
      }

      const response = await fetch(`${apiUrl}/auth/google/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Google login failed')
      }

      const result = await response.json()
      if (!result.access_token || !result.refresh_token) {
        throw new Error('Invalid response from server: Missing tokens')
      }

      localStorage.setItem('access_token', result.access_token)
      localStorage.setItem('refresh_token', result.refresh_token)
      await navigate({ to: '/' })
    } catch (err) {
      console.error('Google login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Google login failed'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, handleGoogleLogin }
}
