import { verifyEmail } from '@/apis/verify-email-api'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2, XCircle } from 'lucide-react'

export function VerifyEmailPage() {
  const search = useSearch({ strict: false })
  const token = search.token
  const navigate = useNavigate()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus('error')
        setMessage('Verification token not found!')
        return
      }
      try {
        const res = await verifyEmail(token)
        if (res.ok) {
          setStatus('success')
          setMessage('Your email has been verified successfully! Redirecting to sign in...')
          if (res.data && res.data.access_token) {
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem('refresh_token', res.data.refresh_token);
            }
          // Lưu lại email nếu cần tự động điền vào sign-in
          if (res.data && res.data.email) {
            localStorage.setItem("signup_email", res.data.email)
          }
          setTimeout(() => {
            navigate({ to: '/' }) 
          }, 1200)
        } else {
          setStatus('error')
          setMessage(res.message || 'Verification failed!')
        }
      } catch (err) {
        setStatus('error')
        if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
          setMessage((err as any).message)
        } else {
          setMessage('An error occurred while verifying your email.')
        }
      }
    }
    verify()
  }, [token, navigate])

  return (
    <div className="min-h-svh flex items-center justify-center bg-[#0d1117]">
      <div className="w-full max-w-md bg-[#161b22] rounded-2xl shadow-xl p-8 text-center border border-slate-800">
        {status === 'pending' && (
          <>
            <div className="flex justify-center mb-6">
              <Spinner className="h-12 w-12 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-100">Verifying your email...</h2>
            <p className="text-slate-400 mb-1">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-green-400">Email Verified!</h2>
            <p className="text-slate-300 mb-2">{message}</p>
            <p className="text-xs text-slate-500">You will be redirected shortly...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="h-14 w-14 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-red-400">Verification Failed</h2>
            <p className="text-slate-300 mb-4">{message}</p>
            <button
              onClick={() => navigate({ to: '/sign-in' })}
              className="mt-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  )
}
