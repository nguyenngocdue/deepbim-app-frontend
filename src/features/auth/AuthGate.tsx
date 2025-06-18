import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGate({ children, fallback = null }: AuthGateProps) {
  const { hasTried } = useSelector((state: RootState) => state.auth);
  if (!hasTried) return fallback; // ❌ no render when authentication not yet
  return <>{children}</>;
}
