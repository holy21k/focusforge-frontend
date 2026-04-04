import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, Menu, User, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../store/authStore';
import { useUI } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';

const BACKEND = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

const buildAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BACKEND}${url}`;
};

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { notificationsEnabled, theme } = useUI();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.username || user?.name || 'User';
  const initials = displayName.charAt(0).toUpperCase();
  const avatarUrl = buildAvatarUrl(user?.avatar_url || user?.profile_photo);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNav = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <header className="topbar">
      <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button className={`p-1.5 rounded transition-all ${
          notificationsEnabled
            ? 'text-zinc-400'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
        }`}>
          {notificationsEnabled ? <BellRing size={14} /> : <Bell size={14} />}
        </button>

        {/* Profile button + dropdown */}
        <div ref={dropdownRef} className="relative flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-1 py-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Open profile menu"
          >
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[11px] font-semibold text-white">
                  {initials}
                </div>
              )}
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white dark:border-zinc-900 rounded-full" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 leading-none">{displayName}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{user?.email || ''}</p>
            </div>
            {/* Chevron */}
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              className={`text-zinc-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            >
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">{displayName}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{user?.email || ''}</p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => handleNav('/settings')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <User size={14} className="text-zinc-400 flex-shrink-0" />
                  My profile
                </button>
                <button
                  onClick={() => handleNav('/settings?tab=notifications')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <Bell size={14} className="text-zinc-400 flex-shrink-0" />
                  Notifications
                </button>
                <button
                  onClick={() => handleNav('/settings?tab=security')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <Shield size={14} className="text-zinc-400 flex-shrink-0" />
                  Security
                </button>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <LogOut size={14} className="flex-shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
