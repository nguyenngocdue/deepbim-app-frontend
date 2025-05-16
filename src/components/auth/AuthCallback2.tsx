import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { clearUser, setCurrentUser } from '@/store/slices/AuthSlice';

export function AuthCallback2() {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          credentials: 'include', // ✅ Gửi cookie qua
        });

        if (!res.ok) throw new Error('Auth failed');
        const { data } = await res.json() as { data: any };
        if(data) {
            dispatch(setCurrentUser(data));
        } else {
          dispatch(clearUser());
        }
        navigate({ to: '/' });
      } catch (err) {
        navigate({ to: '/sign-in', search: { error: 'Authentication failed' } });
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, [navigate]);

  return <div>{loading ? 'Signing in...' : ''}</div>;
}
