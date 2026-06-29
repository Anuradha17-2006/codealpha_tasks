import { format, formatDistance, parseISO } from 'date-fns'

export function formatDate(date: string | Date, formatStr = 'PPP') {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr)
  } catch {
    return 'Invalid date'
  }
}

export function formatDateRelative(date: string | Date) {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistance(dateObj, new Date(), { addSuffix: true })
  } catch {
    return 'Invalid date'
  }
}

export function formatTime(date: string | Date, formatStr = 'p') {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr)
  } catch {
    return 'Invalid time'
  }
}
