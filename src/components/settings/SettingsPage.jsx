import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Lock, Palette, Save, Moon, Sun, Volume2, VolumeX, Mail, AtSign, Camera, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../store/authStore';
import { useUI } from '../../store/uiStore';
import settingsApi from '../../api/settingsApi';
import Button from '../common/Button';
import '../../styles/forms.css';
import '../../styles/cards.css';

const BACKEND = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

const buildAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BACKEND}${url}`;
};

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme, notificationsEnabled, toggleNotifications, soundEnabled, toggleSound } = useUI();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
      });

      const avatarUrl = user.avatar_url || user.profile_photo;
      const url = buildAvatarUrl(avatarUrl);
      if (url) setAvatarPreview(url);

      // ✅ Fetch profile from backend — has_password is false for Google accounts
      settingsApi.getProfile().then((res) => {
        const profile = res.data || res;
        setIsGoogleAccount(!profile.has_password);
      }).catch(() => {
        const av = user.avatar_url || '';
        setIsGoogleAccount(av.startsWith('http://') || av.startsWith('https://'));
      });
    }
  }, [user]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setSuccess('');
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setAvatarLoading(true);
    try {
      const result = await settingsApi.uploadAvatar(file);
      const res = result.data || result;
      const fullUrl = buildAvatarUrl(res.avatar_url);
      setAvatarPreview(fullUrl);
      updateUser({ avatar_url: res.avatar_url });
      setIsGoogleAccount(false);
      showSuccess('Profile photo updated!');
    } catch (err) {
      showError(err.message || 'Failed to upload photo');
      setAvatarPreview(buildAvatarUrl(user?.avatar_url));
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfileSave = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await settingsApi.updateProfile({
        username: profileData.username || undefined,
        email: profileData.email || undefined,
      });
      updateUser({ username: profileData.username, email: profileData.email });
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (isGoogleAccount) {
      showError('This account uses Google Sign-In. Password change is not available.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showError('Passwords do not match');
    }
    if (passwordData.newPassword.length < 6) {
      return showError('Password must be at least 6 characters');
    }
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await settingsApi.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSuccess('Password changed successfully!');
    } catch (err) {
      showError(err?.response?.data?.detail || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-normal text-zinc-700 dark:text-zinc-200">Settings</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage your account</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-400 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="card">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-normal transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-zinc-700 dark:text-zinc-200 border-b-2 border-primary -mb-px'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-auto">

          {/* ─── Profile Tab ─── */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Profile Information</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Update your personal details</p>
              </div>

              <div className="flex items-center gap-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <div className="relative">
                  {avatarPreview ? (
                    <div className="relative">
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-md"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        onClick={handleRemoveAvatar}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {avatarLoading
                        ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : profileData.name?.charAt(0)?.toUpperCase() || 'U'
                      }
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-zinc-800 dark:text-zinc-100">
                    {profileData.name || 'Your Name'}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">@{profileData.username || 'username'}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarLoading}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <Camera size={14} />
                      {avatarLoading ? 'Uploading...' : 'Change'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <AtSign size={14} /> First Name
                  </label>
                  <input type="text" className="form-input"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <AtSign size={14} /> Username
                  </label>
                  <input type="text" className="form-input"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    placeholder="@username" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail size={14} /> Email
                  </label>
                  <input type="email" className="form-input"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="your@email.com" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} disabled={loading} icon={Save}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* ─── Security Tab ─── */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Security</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your account security</p>
              </div>

              {/* ✅ Google users see badge, email users see password form */}
              {isGoogleAccount ? (
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Google Account</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Your account uses Google Sign-In. Password management is handled by Google.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">Current Password</label>
                      <div className="relative">
                        <input type={showPasswords.current ? 'text' : 'password'} className="form-input pr-10"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Enter current password" />
                        <button type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                          {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">New Password</label>
                      <div className="relative">
                        <input type={showPasswords.new ? 'text' : 'password'} className="form-input pr-10"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Enter new password" />
                        <button type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                          {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input type={showPasswords.confirm ? 'text' : 'password'} className="form-input pr-10"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password" />
                        <button type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                          {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <Button onClick={handlePasswordChange} disabled={loading} icon={Lock}>
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── Appearance Tab ─── */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-sm font-normal text-zinc-500 dark:text-zinc-300">Theme</h2>
              <div className="flex gap-3">
                <div
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    theme === 'light' ? 'border-zinc-400 bg-zinc-100 dark:bg-zinc-800' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                  onClick={() => setTheme('light')}
                >
                  <div className="flex items-center gap-2">
                    <Sun size={14} className="text-zinc-500 dark:text-zinc-400" />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Light</span>
                  </div>
                </div>
                <div
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    theme === 'dark' ? 'border-zinc-400 bg-zinc-100 dark:bg-zinc-800' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="flex items-center gap-2">
                    <Moon size={14} className="text-zinc-500 dark:text-zinc-400" />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Dark</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Notifications Tab ─── */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Notifications</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your notification preferences</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Bell size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Push Notifications</span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive notifications on your device</p>
                  </div>
                </div>
                <button onClick={toggleNotifications} className="w-11 h-6 rounded-full relative transition-colors"
                  style={{ backgroundColor: notificationsEnabled ? '#8b5cf6' : '#d4d4d8' }}>
                  <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                    style={{ left: notificationsEnabled ? '22px' : '2px' }} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {soundEnabled
                      ? <Volume2 size={16} className="text-blue-600 dark:text-blue-400" />
                      : <VolumeX size={16} className="text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Sound</span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Play sound for notifications</p>
                  </div>
                </div>
                <button onClick={toggleSound} className="w-11 h-6 rounded-full relative transition-colors"
                  style={{ backgroundColor: soundEnabled ? '#8b5cf6' : '#d4d4d8' }}>
                  <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                    style={{ left: soundEnabled ? '22px' : '2px' }} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;