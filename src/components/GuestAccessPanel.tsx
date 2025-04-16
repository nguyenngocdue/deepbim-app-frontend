import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

interface GuestAccessPanelProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
  dismissable?: boolean;
}

export const GuestAccessPanel = ({
  message = 'You are currently browsing as a guest. Log in to access all features.',
  actionText = 'Sign In',
  onAction,
  dismissable = false,
}: GuestAccessPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const isLoggedIn = !!accessToken;

    if (!isLoggedIn && !toastShown) {
      setTimeout(() => {
        toast.custom((t) => (
          <div className="w-full bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-900 rounded-md shadow-md flex items-start justify-between gap-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-[2px] text-blue-500" />
              <span className="text-sm leading-relaxed font-semibold">
                {message}
              </span>
            </div>
            <div className="flex gap-1 items-end flex-1">
              <button
                onClick={() => {
                  onAction?.();
                  toast.dismiss(t); // tắt khi người dùng nhấn
                }}
                className="text-sm font-medium text-white bg-blue-500 px-4 py-1 rounded hover:bg-blue-600 transition text-nowrap"
              >
                {actionText}
              </button>
              {dismissable && (
                <button
                  onClick={() => toast.dismiss(t)}
                  className="text-blue-600 text-lg hover:opacity-75 -mt-1"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ), {
          duration: Infinity, // 👈 Không tự tắt
        });
        setToastShown(true);
        setIsAuthenticated(false);
      }, 5000);
    }
  }, [toastShown, onAction, actionText, message, dismissable]);

  return null;
};
