import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { clearUser, setCurrentUser, UserProfile } from '@/store/slices/AuthSlice';
import { fetchUserProfile } from '@/api';

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
        const ressult = await res.json();

        const userData = await fetchUserProfile();
        if (userData.data.id) {
          dispatch(setCurrentUser(userData as UserProfile));
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
