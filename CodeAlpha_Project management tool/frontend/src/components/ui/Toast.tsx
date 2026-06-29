import { useEffect } from 'react'
import { useAppStore } from '@store/app'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

interface ToastProps {
  toast: {
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
  }
}

export default function Toast({ toast }: ToastProps) {
  const { removeToast } = useAppStore()

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, removeToast])

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertCircle size={20} />,
  }

  const colors = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-info text-white',
    warning: 'bg-warning text-white',
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${colors[toast.type]} animate-slideInRight`}>
      <div>{icons[toast.type]}</div>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-2 p-0.5 hover:bg-white/20 rounded transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}
