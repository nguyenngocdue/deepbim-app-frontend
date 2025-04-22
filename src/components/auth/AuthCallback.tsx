import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';

export function AuthCallback() {
  const { navigate } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    console.log(params);

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate({ to: '/' });
    } else {
      navigate({ to: '/sign-in', search: { error: 'Authentication failed' } });
    }
  }, [navigate]);

  return <div>Loading...</div>;
}