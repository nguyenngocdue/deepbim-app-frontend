import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CredentialResponse } from '@react-oauth/google';
import { toast } from 'sonner';

export function useGoogleLoginHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setError('');

    try {
      const credential = credentialResponse?.credential;
      if (!credential) {
        throw new Error('Google login failed: Missing credential');
      }

      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${apiUrl}/auth/google/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
        credentials: 'include',
      });
      const { data } = await res.json() as { data: any };

     if (!res.ok) {
        toast.error(data?.message || 'Google login failed');
        throw new Error(data?.message || 'Google login failed');
      }

      const { access_token, refresh_token, user } = data;
      if (!access_token || !refresh_token) {
        throw new Error('Invalid server response: Missing tokens');
      }

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);


      if (user) {
        await navigate({ to: '/' });
      } else {
        await navigate({ to: '/sign-in' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      console.error('[Google Login Error]', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleGoogleLogin };
}
