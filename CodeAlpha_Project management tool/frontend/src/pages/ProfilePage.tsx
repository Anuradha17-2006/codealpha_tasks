import { useState } from 'react'
import { useMe, useUpdateProfile, useChangePassword, useDeleteAccount } from '@api/hooks'
import MainLayout from '@components/layout/MainLayout'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import { useNavigate } from 'react-router-dom'
import { Lock, Trash2, AlertCircle } from 'lucide-react'

export default function ProfilePage() {
  const { data: user, isLoading } = useMe()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount()
  const navigate = useNavigate()

  // Profile form state
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC')
  const [profileEdited, setProfileEdited] = useState(false)

  // Password form state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  if (isLoading) return <MainLayout title="Profile"><div>Loading...</div></MainLayout>
  if (!user) return <MainLayout title="Profile"><div>User not found</div></MainLayout>

  const handleUpdateProfile = () => {
    updateProfile(
      { name, email, bio, timezone },
      {
        onSuccess: () => {
          alert('Profile updated successfully')
          setProfileEdited(false)
        },
        onError: (error: any) => {
          alert('Failed to update profile: ' + (error.message || 'Unknown error'))
        },
      }
    )
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          alert('Password changed successfully')
          setShowPasswordForm(false)
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
        onError: (error: any) => {
          alert('Failed to change password: ' + (error.message || 'Unknown error'))
        },
      }
    )
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm')
      return
    }

    deleteAccount(undefined, {
      onSuccess: () => {
        alert('Account deleted successfully')
        navigate('/login')
      },
      onError: (error: any) => {
        alert('Failed to delete account: ' + (error.message || 'Unknown error'))
      },
    })
  }

  return (
    <MainLayout title="Profile">
      <div className="max-w-2xl space-y-6">
        {/* Personal Information */}
        <Card>
          <h2 className="text-xl font-bold text-text-primary mb-6">Personal Information</h2>

          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setProfileEdited(true)
              }}
              disabled={isUpdating}
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setProfileEdited(true)
              }}
              disabled={isUpdating}
            />

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value)
                  setProfileEdited(true)
                }}
                disabled={isUpdating}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 disabled:bg-main-bg text-sm"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value)
                  setProfileEdited(true)
                }}
                disabled={isUpdating}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 disabled:bg-main-bg text-sm bg-white"
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST (Eastern)</option>
                <option value="CST">CST (Central)</option>
                <option value="MST">MST (Mountain)</option>
                <option value="PST">PST (Pacific)</option>
                <option value="IST">IST (India)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="primary"
                onClick={handleUpdateProfile} 
                loading={isUpdating}
                disabled={!profileEdited}
              >
                Save Changes
              </Button>
              {profileEdited && (
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setName(user.name)
                    setEmail(user.email)
                    setBio(user.bio || '')
                    setTimezone(user.timezone || 'UTC')
                    setProfileEdited(false)
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Security - Password Change */}
        <Card>
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Lock size={20} />
            Security
          </h2>

          {!showPasswordForm ? (
            <Button
              variant="secondary"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          ) : (
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
              />

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="primary"
                  onClick={handleChangePassword} 
                  loading={isChangingPassword}
                >
                  Update Password
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  disabled={isChangingPassword}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Danger Zone - Delete Account */}
        <Card className="border-2 border-red-200 bg-red-50">
          <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            Danger Zone
          </h2>

          <p className="text-sm text-red-600 mb-4">
            Deleting your account is permanent and cannot be undone. All your data will be lost.
          </p>

          {!showDeleteConfirm ? (
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={18} />
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4 p-4 bg-red-100 rounded-lg">
              <p className="text-sm text-text-primary font-semibold">
                To confirm deletion, please type <strong>DELETE</strong> below:
              </p>

              <Input
                type="text"
                placeholder="Type DELETE to confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                disabled={isDeleting}
              />

              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  loading={isDeleting}
                  disabled={deleteConfirmText !== 'DELETE'}
                >
                  Permanently Delete Account
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  )
}
