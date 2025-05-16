import { fetchUserProfile } from '@/api';
import { setCurrentUser, UserProfile } from '@/store/slices/AuthSlice';

interface LoginParams {
  email: string;
  password: string;
}

export async function handleLogin(
  data: LoginParams,
  dispatch: any,
  navigate: any,
  setError: (name: "email" | "password", error: { message: string }) => void
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid email or password');
    }

    const result = await response.json();
    if (!result.access_token || !result.refresh_token) {
      throw new Error('Invalid response from server: Missing tokens');
    }

    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('refresh_token', result.refresh_token);

    const userData = await fetchUserProfile();
    if (userData.id) {
      dispatch(setCurrentUser(userData as UserProfile));
    }

    await navigate({ to: '/' });
  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Something went wrong';

    if (errorMessage.toLowerCase().includes('email')) {
      setError('email', { message: errorMessage });
    } else if (errorMessage.toLowerCase().includes('password')) {
      setError('password', { message: errorMessage });
    }
  }
}
