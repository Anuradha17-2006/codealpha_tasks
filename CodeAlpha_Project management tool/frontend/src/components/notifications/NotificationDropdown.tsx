import { useNotifications, useMarkAsRead } from '@api/hooks'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

interface NotificationDropdownProps {
  onClose: () => void
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { data: notifications = [] } = useNotifications()
  const { mutate: markAsRead } = useMarkAsRead()

  const getIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <AlertCircle size={16} className="text-info" />
      case 'TASK_COMPLETED':
        return <CheckCircle size={16} className="text-success" />
      default:
        return <Info size={16} className="text-primary" />
    }
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-card-bg rounded-lg shadow-lg border border-card-border z-50 animate-slideIn">
      <div className="p-4 border-b border-card-border">
        <h3 className="font-semibold text-text-primary">Notifications</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-0">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{notification.title}</p>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-text-muted mt-2">
                      {formatDistance(new Date(notification.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 border-t border-card-border">
          <Link
            to="/notifications"
            onClick={onClose}
            className="inline-block text-sm text-primary hover:underline font-medium"
          >
            View all notifications →
          </Link>
        </div>
      )}
    </div>
  )
}
