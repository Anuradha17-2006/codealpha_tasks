/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact colors from prototype
        'sidebar-bg': '#0F1117',
        'main-bg': '#F7F8FA',
        'card-bg': '#FFFFFF',
        'primary': '#5C6BC0',
        'primary-hover': '#4D5BA8',
        'text-primary': '#1A1D23',
        'text-muted': '#6B7280',
        'text-secondary': '#A8ADB8',
        'border': '#E5E7EB',
        'border-light': '#E5E7EB',
        'success': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'urgent': '#EF4444',
        'priority': {
          'low': '#9CA3AF',
          'medium': '#3B82F6',
          'high': '#F59E0B',
          'urgent': '#EF4444',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', '1.4'],
        'sm': ['13px', '1.5'],
        'base': ['14px', '1.5'],
        'lg': ['16px', '1.5'],
        'xl': ['18px', '1.5'],
        '2xl': ['20px', '1.4'],
        '3xl': ['24px', '1.4'],
        '4xl': ['32px', '1.2'],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      spacing: {
  '0.5': '2px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '12': '48px',

  // Add this
  sidebar: '240px',
},
      borderRadius: {
        '0': '0px',
        'sm': '4px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 24px rgba(0, 0, 0, 0.15)',
      },
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '50': '50',
        '100': '100',
        '1000': '1000',
      },
      width: {
        'sidebar': '240px',
      },
    },
  },
  plugins: [],
}
