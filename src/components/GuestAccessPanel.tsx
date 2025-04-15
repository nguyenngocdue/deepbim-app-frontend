import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IoMdCloseCircle } from 'react-icons/io';

interface GuestAccessPanelProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  dismissable?: boolean;
}

export const GuestAccessPanel = ({
  message = 'You are currently browsing as a guest. Log in to access all features.',
  actionText = 'Sign In',
  onAction,
  className,
  dismissable = false,
}: GuestAccessPanelProps) => {
  const [visible, setVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem('access_token');
      const isLoggedIn = !!accessToken;

      if (!isLoggedIn) {
        setTimeout(() => {
          setVisible(true);
          setIsAuthenticated(false);
        }, 5000);
      }
    };

    checkAuthStatus();
  }, []);

  if (!visible || isAuthenticated) return null;

  return (
    <div
      className={cn(
        'bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-900 flex justify-between items-center shadow-sm rounded-md animate-fadeIn',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-500" />
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-2">
        {onAction && (
          <button
            onClick={onAction}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
          >
            {actionText}
          </button>
        )}
        {dismissable && (
          <button
            onClick={() => setVisible(false)}
            className="text-xl text-blue-700 hover:opacity-75 transition duration-300"
          >
            <IoMdCloseCircle />
          </button>
        )}
      </div>
    </div>
  );
};