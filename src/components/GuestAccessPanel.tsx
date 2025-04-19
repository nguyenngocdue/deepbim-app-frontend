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
  message = 'Bạn đang dùng chế độ khách. Đăng nhập để truy cập các chức năng cao cấp.',
  actionText = 'Đăng nhập',
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
          <div className=" max-w-[calc(100vw-1rem)] mx-auto bg-blue-50 border border-blue-200 px-2 py-2 text-blue-900 rounded-md shadow-md flex gap-2">
            <div className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" />
              <span className="text-xs leading-relaxed font-semibold break-words">
                {message}
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => {
                  onAction?.();
                  toast.dismiss(t);
                }}
                className="text-xs font-medium text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 transition text-nowrap"
              >
                {actionText} {/* Đăng nhập */}
              </button>
              {dismissable && (
                <button
                  onClick={() => toast.dismiss(t)}
                  className="text-blue-600 text-sm hover:opacity-75"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ), {
          duration: Infinity,
          className: 'mt-16 mb-16', // Avoid overlap with header and bottom nav
        });
        setToastShown(true);
        setIsAuthenticated(false);
      }, 5000);
    }
  }, [toastShown, onAction, actionText, message, dismissable]);

  return null;
};