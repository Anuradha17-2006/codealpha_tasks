import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/auth'
import { useProjects } from '@api/hooks'
import { LayoutDashboard, Kanban, Bell, User, LogOut, Plus } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { data: projects = [] } = useProjects()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/board', label: 'Board', icon: Kanban },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-sidebar bg-sidebar-bg text-white flex flex-col border-r border-white border-opacity-10 z-1000">
      {/* Logo */}
      <div className="px-4 py-6 border-b border-white border-opacity-10">
        <h1 className="text-2xl font-bold text-primary">Projex</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Projects Section */}
      <div className="px-4 py-4 border-t border-white border-opacity-10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-text-secondary uppercase">Projects</span>
          <button className="p-1 rounded hover:bg-white hover:bg-opacity-10">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {projects.slice(0, 5).map((project: any) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}/board`}
              className="block px-3 py-2 rounded text-xs text-text-secondary hover:bg-white hover:bg-opacity-10 truncate transition-all"
            >
              {project.name}
            </Link>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-white border-opacity-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs">
              <div className="font-medium">{user?.name}</div>
              <div className="text-text-secondary text-xs">{user?.email}</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            logout()
            window.location.href = '/login'
          }}
          className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:bg-white hover:bg-opacity-10 rounded transition-all"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
