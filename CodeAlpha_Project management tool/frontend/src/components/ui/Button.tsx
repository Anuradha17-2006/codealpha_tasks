import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  href?: string
}

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  href,
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all inline-flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover disabled:opacity-50',
    secondary: 'bg-white border border-border text-text-primary hover:bg-main-bg disabled:opacity-50',
    danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-50',
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
