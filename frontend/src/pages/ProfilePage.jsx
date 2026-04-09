import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import api from '../api/client';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage({ section = 'profile' }) {
  const { notify } = useOutletContext();
  const { user, refreshProfile, loading } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });

  useEffect(() => {
    setProfileForm({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const updateProfile = async (event) => {
    event.preventDefault();
    try {
      await api.put('/user/profile', profileForm);
      await refreshProfile();
      notify('success', 'Profile updated', 'Your account details were saved successfully.');
    } catch (error) {
      notify('error', 'Profile update failed', error.response?.data?.message || 'Unable to save changes.');
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    try {
      await api.post('/user/change-password', passwordForm);
      setPasswordForm({ current_password: '', new_password: '' });
      notify('success', 'Password changed', 'Your password has been updated successfully.');
    } catch (error) {
      notify('error', 'Password update failed', error.response?.data?.message || 'Unable to change the password.');
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <h2 className="text-2xl font-bold">Account settings</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Update your profile details and manage password security from one place.
        </p>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard className={section === 'profile' ? 'ring-2 ring-brand-500/40' : ''}>
          <h3 className="text-lg font-semibold">Edit profile</h3>
          <form className="mt-4 space-y-4" onSubmit={updateProfile}>
            <input
              className="input-field"
              value={profileForm.name}
              onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
              placeholder="Full name"
              required
            />
            <input
              type="email"
              className="input-field"
              value={profileForm.email}
              onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
              placeholder="Email"
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              Save profile
            </button>
          </form>
        </GlassCard>

        <GlassCard className={section === 'password' ? 'ring-2 ring-brand-500/40' : ''}>
          <h3 className="text-lg font-semibold">Change password</h3>
          <form className="mt-4 space-y-4" onSubmit={changePassword}>
            <input
              type="password"
              className="input-field"
              value={passwordForm.current_password}
              onChange={(event) => setPasswordForm({ ...passwordForm, current_password: event.target.value })}
              placeholder="Current password"
              required
            />
            <input
              type="password"
              className="input-field"
              value={passwordForm.new_password}
              onChange={(event) => setPasswordForm({ ...passwordForm, new_password: event.target.value })}
              placeholder="New password"
              required
            />
            <button type="submit" className="btn-primary">
              Update password
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
