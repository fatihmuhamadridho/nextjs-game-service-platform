'use client';

import { apiFetch } from '@services/apiFetch.service';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';
import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconDeviceGamepad2,
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconSearch,
  IconShoppingCart,
  IconX,
} from '@tabler/icons-react';
import styles from './Header.module.css';
import { FEATURE_SPRINT_2 } from '@configs/base.config';
import {
  clearSessionType,
  getSessionType,
  legacySessionTypeStorageKey,
  sessionEstablishedEvent,
  sessionEndedEvent,
  sessionTypeStorageKey,
  setSessionType,
} from '@utils/brandStorage';

type AccountType = 'ADMIN';
type HeaderAccount = {
  accountType: AccountType;
  name: string;
  username: string;
  role: string;
  roleLabel: string;
  canAccessDashboard: boolean;
};

type Props = {
  variant?: 'storefront' | 'checkout';
  activePage?: 'home' | 'games';
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showMobileSearch?: boolean;
  mobileSearchRow?: boolean;
  onMobileFilterToggle?: () => void;
};
const Logo = () => (
  <Link className={styles.logo} href="/">
    <span className={styles.logoIcon}>
      <IconDeviceGamepad2 />
    </span>
    <span>
      bonga<span>store</span>
    </span>
  </Link>
);

export const Header = ({
  variant = 'storefront',
  activePage,
  searchValue,
  onSearchChange,
  showMobileSearch = true,
  mobileSearchRow = false,
  onMobileFilterToggle,
}: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [account, setAccount] = useState<HeaderAccount | null>();
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const search = searchValue ?? localSearch;
  const updateSearch = onSearchChange ?? setLocalSearch;

  useEffect(() => {
    let active = true;
    const loadAccount = async (requestedType?: string | null) => {
      const savedType = requestedType ?? getSessionType();
      const savedAccountType = savedType === 'ADMIN' ? savedType : null;
      const accountType =
        savedAccountType ??
        null;
      if (!accountType) {
        clearSessionType();
        setAccount(null);
        return;
      }
      const sessionUrl = () => '/api/auth/v1/session?accountType=ADMIN';
      try {
        let response = await apiFetch(sessionUrl(), { cache: 'no-store' });
        if (!response.ok && response.status === 401) {
          const refreshType = accountType ?? response.headers.get('X-Account-Type');
          if (refreshType !== 'ADMIN' && refreshType !== 'CUSTOMER') return;
          if (refreshType !== 'ADMIN') return;
          const refreshed = await apiFetch('/api/admin/auth/v1/refresh-token', { method: 'POST', cache: 'no-store' });
          if (refreshed.ok)
            response = await apiFetch(`/api/auth/v1/session?accountType=${refreshType}`, { cache: 'no-store' });
        }
        if (!active) return;
        if (!response.ok) {
          setAccount(null);
          if (response.status === 401) {
            clearSessionType();
            window.dispatchEvent(new Event(sessionEndedEvent));
          }
          return;
        }
        const result = (await response.json()) as { data?: HeaderAccount | null };
        const nextAccount = result.data ?? null;
        setAccount(nextAccount);
        if (nextAccount?.accountType) {
          setSessionType(nextAccount.accountType);
        }
      } catch {
        if (active) setAccount(null);
      }
    };

    const onSessionEstablished = (event: Event) => {
      void loadAccount((event as CustomEvent<AccountType>).detail);
    };

    const onSessionEnded = () => {
      setAccount(null);
      setProfileOpen(false);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === legacySessionTypeStorageKey) {
        if (event.newValue === 'ADMIN' || event.newValue === 'CUSTOMER') {
          setSessionType(event.newValue);
          void loadAccount(event.newValue);
        }
        return;
      }
      if (event.key !== sessionTypeStorageKey) return;
      if (event.newValue === 'ADMIN' || event.newValue === 'CUSTOMER') {
        setSessionType(event.newValue);
        void loadAccount(event.newValue);
      } else {
        setAccount(null);
        setProfileOpen(false);
        clearSessionType();
      }
    };
    void loadAccount();
    window.addEventListener(sessionEstablishedEvent, onSessionEstablished);
    window.addEventListener(sessionEndedEvent, onSessionEnded);
    window.addEventListener('storage', onStorage);
    return () => {
      active = false;
      window.removeEventListener(sessionEstablishedEvent, onSessionEstablished);
      window.removeEventListener(sessionEndedEvent, onSessionEnded);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
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

  const logout = async () => {
    if (!account || loggingOut) return;
    setLoggingOut(true);
    setLogoutError('');
    try {
      const response = await apiFetch('/api/admin/auth/v1/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout gagal. Coba lagi.');
      clearSessionType();
      window.dispatchEvent(new Event(sessionEndedEvent));
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Logout gagal. Coba lagi.');
    } finally {
      setLoggingOut(false);
    }
  };

  const profileAction = account ? (
    <div className={styles.profileMenu} ref={profileRef}>
      <button
        className={styles.profileToggle}
        aria-label={`Menu akun ${account.name}`}
        aria-haspopup="menu"
        aria-expanded={profileOpen}
        aria-controls="public-profile-menu"
        onClick={() => setProfileOpen((open) => !open)}
      >
        <span className={styles.profileAvatar}>{account.name.trim().charAt(0).toUpperCase() || 'A'}</span>
        <span className={styles.profileText}>
          <b>{account.name}</b>
          <small>{account.roleLabel}</small>
        </span>
        <IconChevronDown aria-hidden="true" />
      </button>
      {profileOpen && (
        <div className={styles.profileDropdown} id="public-profile-menu" role="menu" aria-label="Menu akun">
          <div className={styles.dropdownIdentity}>
            <b>{account.name}</b>
            <small>{account.roleLabel}</small>
          </div>
          {account.canAccessDashboard && (
            <Link href="/admin" role="menuitem" onClick={() => setProfileOpen(false)}>
              <IconLayoutDashboard aria-hidden="true" /> Dashboard Admin
            </Link>
          )}
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
  ) : null;

  return (
    <header className={`${styles.header} ${variant === 'checkout' ? styles.checkout : ''}`}>
      <div className={styles.navWrap}>
        <button className={styles.menuButton} aria-label="Buka menu" onClick={() => setMenuOpen(true)}>
          <IconMenu2 />
        </button>
        <Logo />
        <nav className={styles.desktopNav} aria-label="Navigasi utama">
          <Link className={activePage === 'home' ? styles.active : ''} href="/">
            Beranda
          </Link>
          <Link href="/games">Games</Link>
          <Link href="/cek-pesanan">Cek Pesanan</Link>
        </nav>
        {FEATURE_SPRINT_2 ? (
          variant === 'storefront' && (
            <form
              className={`${styles.search} ${searchOpen ? styles.searchExpanded : ''}`}
              onSubmit={(event) => event.preventDefault()}
            >
              <IconSearch />
              <input
                aria-label="Cari game atau layanan"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Cari game atau layanan..."
              />
              <kbd>Ctrl K</kbd>
            </form>
          )
        ) : (
          <form className="w-full"></form>
        )}
        <div className={styles.actions}>
          {variant === 'storefront' ? (
            <>
              {account ? (
                profileAction
              ) : !account ? (
                <>
                  {FEATURE_SPRINT_2 && (
                    <button className={styles.cart} aria-label="Keranjang">
                      <IconShoppingCart />
                      <i>2</i>
                    </button>
                  )}
                  <Link className={styles.login} href="/login">
                    Login Admin
                  </Link>
                </>
              ) : null}
              {FEATURE_SPRINT_2 && showMobileSearch && (
                <button className={styles.searchToggle} aria-label="Cari" onClick={() => setSearchOpen(!searchOpen)}>
                  <IconSearch />
                </button>
              )}
            </>
          ) : (
            account ? profileAction : (
              <Link className={styles.login} href="/login">
                Login Admin
              </Link>
            )
          )}
        </div>
      </div>
      {variant === 'storefront' && mobileSearchRow && (
        <div className={styles.mobileSearchRow}>
          <IconSearch />
          <input value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Cari game..." />
          <button aria-label="Filter game" onClick={onMobileFilterToggle}>
            <IconAdjustmentsHorizontal />
          </button>
        </div>
      )}
      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)}>
          <nav className={styles.drawer} aria-label="Menu mobile" onClick={(event) => event.stopPropagation()}>
            <div>
              <Logo />
              <button aria-label="Tutup menu" onClick={() => setMenuOpen(false)}>
                <IconX />
              </button>
            </div>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Beranda
            </Link>
            <Link href="/games" onClick={() => setMenuOpen(false)}>
              Games
            </Link>
            <Link href="/cek-pesanan" onClick={() => setMenuOpen(false)}>
              Cek Pesanan
            </Link>
            {!account && (
              <div className={styles.drawerAuthActions}>
                <Link className={styles.drawerLogin} href="/login" onClick={() => setMenuOpen(false)}>
                  Login Admin
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
