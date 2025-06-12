import { useState } from 'react';

export function useGoogleLoginHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const triggerGoogleRedirect = async () => {
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      if (!apiUrl) throw new Error('VITE_API_BASE_URL is not defined');

      const res = await fetch(`${apiUrl}/auth/google-url`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to get Google login URL');
      }

      const { url } = await res.json();
      if (!url) throw new Error('Missing redirect URL from server');

      window.location.href = url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      console.error('[Google Redirect Error]', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, triggerGoogleRedirect };
}
