import { useNotifications } from '@api/hooks'
import MainLayout from '@components/layout/MainLayout'
import Card from '@components/ui/Card'
import { Bell, Trash2 } from 'lucide-react'

export default function NotificationsPage() {
  const { data: notifications = [] } = useNotifications()

  return (
    <MainLayout title="Notifications">
      <div className="max-w-2xl space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
              <p className="text-text-muted">You have no notifications yet</p>
            </div>
          </Card>
        ) : (
          notifications.map((notif: any) => (
            <Card key={notif.id} className="hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-text-primary font-medium">{notif.message}</p>
                  <p className="text-xs text-text-muted mt-2">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="p-2 hover:bg-main-bg rounded text-text-muted hover:text-danger transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </MainLayout>
  )
}
