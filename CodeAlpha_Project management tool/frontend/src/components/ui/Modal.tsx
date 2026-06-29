import React from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000">
      <div className={`bg-white rounded-lg shadow-lg ${sizes[size]} w-11/12 max-h-96 overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-border">
          {title && <h2 className="text-2xl font-bold text-text-primary">{title}</h2>}
          <button
            onClick={onClose}
            className="p-1 hover:bg-main-bg rounded transition-all text-text-muted"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
