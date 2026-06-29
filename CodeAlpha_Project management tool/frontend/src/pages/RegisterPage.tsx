import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRegister } from '@api/hooks'
import { useAuthStore } from '@store/auth'
import { useAppStore } from '@store/app'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { mutate: register, isPending } = useRegister()
  const { loginSuccess } = useAuthStore()
  const { addToast } = useAppStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    register(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
      {
        onSuccess: (data) => {
          loginSuccess(data)
          addToast('Account created successfully!', 'success')
          navigate('/dashboard')
        },
        onError: () => {
          addToast('Registration failed. Please try again.', 'error')
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
          <p className="text-text-muted">Create a new account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            icon={<User size={18} className="text-text-muted" />}
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

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

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={formData.showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 pl-10 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, showConfirmPassword: !formData.showConfirmPassword })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {formData.showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-danger">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" variant="primary" size="md" fullWidth loading={isPending}>
            {isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
