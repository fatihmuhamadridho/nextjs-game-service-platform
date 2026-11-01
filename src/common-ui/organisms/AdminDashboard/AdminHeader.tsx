'use client';

import { apiFetch } from '@services/apiFetch.service';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconBell, IconChevronDown, IconDeviceGamepad2, IconLogout, IconMenu2, IconSearch } from '@tabler/icons-react';
import styles from './AdminHeader.module.css';
import { FEATURE_SPRINT_2 } from '@configs/base.config';
import { clearSessionType, sessionEndedEvent } from '@utils/brandStorage';

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onMenuOpen: () => void;
};

type AdminProfile = { name: string; role: string };

export const AdminHeader = ({ query, onQueryChange, onMenuOpen }: Props) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    void apiFetch('/api/auth/v1/session?accountType=ADMIN', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = (await response.json()) as { data?: { name?: string; role?: string } };
        return payload.data;
      })
      .then((account) => {
        if (active && account?.name) setProfile({ name: account.name, role: account.role ?? 'Administrator' });
      })
      .catch(() => {
        if (active) setProfile(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError('');
    try {
      const response = await apiFetch('/api/admin/auth/v1/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout gagal. Coba lagi.');
      clearSessionType();
      window.dispatchEvent(new Event(sessionEndedEvent));
      router.replace('/login?next=/admin');
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Logout gagal. Coba lagi.');
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!profileOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [profileOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <button className={styles.menu} aria-label="Buka navigasi admin" onClick={onMenuOpen}>
          <IconMenu2 />
        </button>
        <a href="/admin">
          <IconDeviceGamepad2 />
          <b>
            bonga<span>store</span>
          </b>
        </a>
        <small>Admin</small>
      </div>
      {FEATURE_SPRINT_2 && (
        <label className={styles.search}>
          <IconSearch />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Cari pesanan, user, game, atau layanan..."
          />
          <kbd>Ctrl K</kbd>
        </label>
      )}
      <div className={styles.actions} ref={actionsRef}>
        {FEATURE_SPRINT_2 && (
          <button className={styles.bell} aria-label="Notifikasi">
            <IconBell />
            <i />
          </button>
        )}
        <button
          className={styles.profile}
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          aria-controls="admin-profile-menu"
          onClick={() => setProfileOpen((open) => !open)}
        >
          <span className={styles.avatar}>{profile?.name.trim().charAt(0).toUpperCase() || 'A'}</span>
          <span>
            <b>{profile?.name ?? 'Admin'}</b>
            <small>{profile?.role ?? 'Administrator'}</small>
          </span>
          <IconChevronDown />
        </button>
        <button
          className={styles.mobileAvatar}
          aria-label="Profil"
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          aria-controls="admin-profile-menu"
          onClick={() => setProfileOpen((open) => !open)}
        >
          {profile?.name.trim().charAt(0).toUpperCase() || 'A'}
        </button>
        {profileOpen && (
          <div className={styles.profileDropdown} id="admin-profile-menu" role="menu" aria-label="Menu profil">
            <div className={styles.dropdownIdentity}>
              <b>{profile?.name ?? 'Admin'}</b>
              <small>{profile?.role ?? 'Administrator'}</small>
            </div>
            <button role="menuitem" disabled={loggingOut} onClick={() => void logout()}>
              <IconLogout aria-hidden="true" /> {loggingOut ? 'Keluar…' : 'Keluar'}
            </button>
            {logoutError && (
              <p className={styles.logoutError} role="alert">
                {logoutError}
              </p>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
