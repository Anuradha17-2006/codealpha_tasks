import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLogin } from '@api/hooks'
import { useAuthStore } from '@store/auth'
import { useAppStore } from '@store/app'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { mutate: login, isPending } = useLogin()
  const { loginSuccess } = useAuthStore()
  const { addToast } = useAppStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    showPassword: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    login(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      },
      {
        onSuccess: (data) => {
          loginSuccess(data)
          addToast('Login successful!', 'success')
          navigate('/dashboard')
        },
        onError: () => {
          addToast('Invalid email or password', 'error')
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="bg-card-bg rounded-lg shadow-md p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Projex</h1>
          <p className="text-text-muted">Welcome back! Please login to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            icon={<Mail size={18} className="text-text-muted" />}
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
            <div className="relative">
              <input
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 pl-10 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {formData.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-muted">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="md" fullWidth loading={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-8 pt-6 border-t border-border-light">
          <p className="text-xs text-text-muted mb-3">Demo Credentials:</p>
          <div className="space-y-2 text-xs text-text-muted bg-gray-50 p-3 rounded">
            <p>📧 admin@projex.com</p>
            <p>🔑 Password@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
