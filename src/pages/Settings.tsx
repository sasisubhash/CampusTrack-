import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/features/auth/AuthContext'
import { useUIStore } from '@/store/uiStore'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

// Password strength check
const getPasswordStrength = (password: string) => {
  if (!password) return null
  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 1) return { level: 'Weak', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' }
  if (strength === 2) return { level: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
  return { level: 'Strong', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' }
}

// Email validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Phone validation (basic)
const isValidPhone = (phone: string) => /^\+?[\d\s\-()]+$/.test(phone) && phone.length >= 10

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useUIStore()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  })
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [profileDirty, setProfileDirty] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')

  // Password state
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Notifications state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    assignmentReminders: true,
    attendanceAlerts: true,
  })
  const [notificationFrequency, setNotificationFrequency] = useState('instant')

  // Appearance state
  const [appearanceTheme, setAppearanceTheme] = useState(theme)
  const [fontSize, setFontSize] = useState('medium')
  const [accentColor, setAccentColor] = useState('blue')

  // Last updated tracking
  const [lastUpdated, setLastUpdated] = useState('Just now')

  // Show modal for dangerous actions
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Profile field change
  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    setProfileDirty(true)
  }

  // Avatar change
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        setProfileData((prev) => ({ ...prev, avatar: result }))
        setProfileDirty(true)
      }
      reader.readAsDataURL(file)
    }
  }

  // Validate profile
  const validateProfile = () => {
    const errors: Record<string, string> = {}

    if (!profileData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!profileData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    if (!profileData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(profileData.email)) {
      errors.email = 'Please enter a valid email'
    }
    if (profileData.phone && !isValidPhone(profileData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Save profile
  const handleSaveProfile = () => {
    if (validateProfile()) {
      updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        avatar: profileData.avatar,
      })
      setProfileDirty(false)
      setLastUpdated(new Date().toLocaleTimeString())
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
    }
  }

  // Cancel profile changes
  const handleCancelProfile = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
    })
    setAvatarPreview(user?.avatar || '')
    setProfileDirty(false)
    setProfileErrors({})
  }

  // Validate password
  const validatePassword = () => {
    const errors: Record<string, string> = {}

    // Mock validation: current password should be "password"
    if (passwordData.current !== 'password') {
      errors.current = 'Current password is incorrect'
    }
    if (passwordData.new.length < 8) {
      errors.new = 'New password must be at least 8 characters'
    }
    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = 'Passwords do not match'
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Change password
  const handleChangePassword = () => {
    if (validatePassword()) {
      setPasswordData({ current: '', new: '', confirm: '' })
      setPasswordErrors({})
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      })
    }
  }

  // Toggle notification
  const handleToggleNotification = (key: keyof typeof notifications) => {
    if (!notificationsEnabled) return
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    toast({
      title: 'Success',
      description: 'Notification preference updated',
    })
  }

  // Mute all
  const handleMuteAll = () => {
    setNotificationsEnabled(!notificationsEnabled)
    if (!notificationsEnabled) {
      // Re-enable with previous state
      setNotifications({
        email: true,
        push: true,
        assignmentReminders: true,
        attendanceAlerts: true,
      })
    }
    toast({
      title: 'Success',
      description: notificationsEnabled ? 'All notifications muted' : 'Notifications enabled',
    })
  }

  // Change theme
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setAppearanceTheme(newTheme)
    setTheme(newTheme)
    toast({
      title: 'Success',
      description: `Theme changed to ${newTheme}`,
    })
  }

  const passwordStrength = getPasswordStrength(passwordData.new)

  return (
    <div className="p-6 space-y-6 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Unsaved Changes Warning */}
      {profileDirty && (
        <Card className="border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6 flex items-center justify-between">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              You have unsaved changes to your profile
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancelProfile}>
                Discard
              </Button>
              <Button size="sm" onClick={handleSaveProfile}>
                Save Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 pb-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
            {lastUpdated !== 'Just now' && (
              <p className="text-xs text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="text-lg">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={handleAvatarClick}>
                  Change Avatar
                </Button>
                {avatarPreview && avatarPreview !== user?.avatar && (
                  <p className="text-xs text-muted-foreground">Preview showing new avatar</p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <Separator />

            {/* Name Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  placeholder="First name"
                  className={profileErrors.firstName ? 'border-red-500' : ''}
                />
                {profileErrors.firstName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {profileErrors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  placeholder="Last name"
                  className={profileErrors.lastName ? 'border-red-500' : ''}
                />
                {profileErrors.lastName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {profileErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="Email"
                className={profileErrors.email ? 'border-red-500' : ''}
              />
              {profileErrors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {profileErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="Phone number"
                className={profileErrors.phone ? 'border-red-500' : ''}
              />
              {profileErrors.phone && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {profileErrors.phone}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
              {profileDirty && (
                <Button variant="outline" onClick={handleCancelProfile}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className={passwordErrors.current ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.current && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {passwordErrors.current}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className={passwordErrors.new ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.new && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {passwordErrors.new}
                </p>
              )}
              {passwordStrength && (
                <div className={`text-xs p-2 rounded ${passwordStrength.bg}`}>
                  <span className={passwordStrength.color}>
                    Strength: {passwordStrength.level}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className={passwordErrors.confirm ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.confirm && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {passwordErrors.confirm}
                </p>
              )}
            </div>

            <Button onClick={handleChangePassword}>Change Password</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Enable All Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Master control for all notification types
                </p>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={handleMuteAll} />
            </div>

            <Separator />

            {/* Notification Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Notification Frequency</Label>
              <select
                id="frequency"
                value={notificationFrequency}
                onChange={(e) => setNotificationFrequency(e.target.value)}
                disabled={!notificationsEnabled}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm disabled:opacity-50"
              >
                <option value="instant">Instant</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
            </div>

            <Separator />

            {/* Individual Toggles */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={() => handleToggleNotification('email')}
                disabled={!notificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in browser
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={() => handleToggleNotification('push')}
                disabled={!notificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Assignment Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about upcoming deadlines
                </p>
              </div>
              <Switch
                checked={notifications.assignmentReminders}
                onCheckedChange={() => handleToggleNotification('assignmentReminders')}
                disabled={!notificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Attendance Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get alerts when attendance is low
                </p>
              </div>
              <Switch
                checked={notifications.attendanceAlerts}
                onCheckedChange={() => handleToggleNotification('attendanceAlerts')}
                disabled={!notificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme */}
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <Button
                    key={t}
                    variant={appearanceTheme === t ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange(t)}
                    className="flex-1"
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Font Size */}
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <select
                id="fontSize"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <Separator />

            {/* Accent Color */}
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <select
                id="accentColor"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast({
                  title: 'Account Deleted',
                  description: 'Your account has been deleted',
                })
                setShowDeleteConfirm(false)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
