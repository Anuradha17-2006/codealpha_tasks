import { Bell, User } from 'lucide-react'
import { useAuthStore } from '@store/auth'

interface NavbarProps {
  title?: string
}

export default function Navbar({ title = 'Dashboard' }: NavbarProps) {
  const { user } = useAuthStore()

  return (
    <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-100">
      {/* Title */}
      <h1 className="text-2xl font-bold text-text-primary">{title}</h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="p-2 rounded-lg hover:bg-main-bg transition-all text-text-muted hover:text-text-primary">
          <Bell size={20} />
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-all">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  )
}
