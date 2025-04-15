import { ReactNode, useState } from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GuestAccessPanelProps {
  message?: string
  actionText?: string
  onAction?: () => void
  className?: string
  dismissable?: boolean
}

export const GuestAccessPanel = ({
  message = 'Bạn đang truy cập với tư cách khách. Đăng nhập để trải nghiệm đầy đủ tính năng!',
  actionText = 'Đăng nhập',
  onAction,
  className,
  dismissable = false,
}: GuestAccessPanelProps) => {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      className={cn(
        'bg-yellow-50 border border-yellow-300 px-4 py-3 text-sm text-yellow-900 flex justify-between items-center shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-yellow-500" />
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-2">
        {onAction && (
          <button
            onClick={onAction}
            className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition"
          >
            {actionText}
          </button>
        )}
        {dismissable && (
          <button
            onClick={() => setVisible(false)}
            className="text-xs text-yellow-700 hover:underline"
          >
            Đóng
          </button>
        )}
      </div>
    </div>
  )
}
