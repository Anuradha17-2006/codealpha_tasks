interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function LoadingSpinner({ size = 'md', color = '#5C6BC0' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizeClasses[size]} border-2 border-current border-r-transparent rounded-full animate-spin`}
         style={{ borderTopColor: color, borderRightColor: 'transparent', borderBottomColor: color, borderLeftColor: color }} />
  )
}
