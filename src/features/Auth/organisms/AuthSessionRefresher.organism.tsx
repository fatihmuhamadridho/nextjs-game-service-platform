'use client';

import { apiFetch } from '@services/apiFetch.service';

import { useEffect } from 'react';
import {
  clearSessionType,
  getRefreshLockKeys,
  getSessionType,
  sessionEstablishedEvent,
  sessionEndedEvent,
  setSessionType,
} from '@utils/brandStorage';
const refreshIntervalMs = 8 * 60 * 1000;

type AccountType = 'ADMIN';

export function AuthSessionRefresher() {
  useEffect(() => {
    let lastRefreshAt = Date.now();
    let active = true;

    const refresh = async (accountType: AccountType): Promise<boolean | null> => {
      const [lockKey, legacyLockKey] = getRefreshLockKeys(accountType);
      const now = Date.now();
      const lockOwner = `${now}-${Math.random().toString(36).slice(2)}`;
      const lockValue = `${lockOwner}:${now + 20_000}`;
      try {
        const activeLock = window.localStorage.getItem(lockKey) ?? window.localStorage.getItem(legacyLockKey) ?? '';
        const [activeOwner, expiryText] = activeLock.split(':');
        if (activeOwner && Number(expiryText) > now) return null;
        window.localStorage.setItem(lockKey, lockValue);
        window.localStorage.setItem(legacyLockKey, lockValue);
      } catch {
        // Storage can be disabled; the endpoint still enforces single-use token rotation.
      }

      try {
        const endpoint = '/api/admin/auth/v1/refresh-token';
        const response = await apiFetch(endpoint, { method: 'POST', cache: 'no-store' });
        if (response.ok) {
          lastRefreshAt = Date.now();
          setSessionType(accountType);
          return true;
        }
        if (response.status === 401) {
          clearSessionType();
          window.dispatchEvent(new Event(sessionEndedEvent));
        } else return null;
      } catch {
        // Keep current access session; next timer/focus event retries while refresh token remains valid.
        return null;
      } finally {
        try {
          if (window.localStorage.getItem(lockKey) === lockValue) window.localStorage.removeItem(lockKey);
          if (window.localStorage.getItem(legacyLockKey) === lockValue) window.localStorage.removeItem(legacyLockKey);
        } catch {
          // Ignore storage cleanup failures.
        }
      }
      return false;
    };

    const refreshExpiredLogin = () => {
      const requested = new URLSearchParams(window.location.search).get('refresh');
      if (requested !== 'admin') return false;
      const type = 'ADMIN';
      void refresh(type).then((ok) => {
        if (!active) return;
        if (ok === null) {
          window.setTimeout(() => {
            if (!active) return;
            void refresh(type).then((retry) => {
              if (!active) return;
              window.location.replace(retry ? (type === 'ADMIN' ? '/admin' : '/') : '/login');
            });
          }, 1000);
          return;
        }
        window.location.replace(ok ? (type === 'ADMIN' ? '/admin' : '/') : '/login');
      });
      return true;
    };

    if (refreshExpiredLogin())
      return () => {
        active = false;
      };

    const refreshCurrentSession = () => {
      if (Date.now() - lastRefreshAt < refreshIntervalMs) return;
      const type = getSessionType();
      if (type === 'ADMIN') void refresh(type);
      lastRefreshAt = Date.now();
    };
    const timer = window.setInterval(refreshCurrentSession, refreshIntervalMs);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshCurrentSession();
    };
    const onSessionEstablished = (event: Event) => {
      const type = (event as CustomEvent<AccountType>).detail;
      if (type === 'ADMIN') {
        setSessionType(type);
        lastRefreshAt = Date.now();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener(sessionEstablishedEvent, onSessionEstablished);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener(sessionEstablishedEvent, onSessionEstablished);
    };
  }, []);

  return null;
}
