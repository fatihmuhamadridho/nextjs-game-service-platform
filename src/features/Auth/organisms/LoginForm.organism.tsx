'use client';

import { apiFetch } from '@services/apiFetch.service';

import { useState, type FormEvent } from 'react';
import { IconEye, IconEyeOff, IconLock, IconUser } from '@tabler/icons-react';
import styles from '../templates/Auth.module.css';
import { AuthSubmit } from '../atoms/AuthSubmit.atom';
import { useRouter } from 'next/navigation';
import { sessionEstablishedEvent, setSessionType } from '@utils/brandStorage';

export function LoginForm() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const identifier = String(form.get('identifier') ?? '').trim();
    const query = new URLSearchParams(window.location.search);
    try {
      const response = await apiFetch('/api/admin/auth/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: String(form.get('password') ?? '') }),
      });
      const result = await response.json();
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        setNotice(
          retryAfter
            ? `Terlalu banyak percobaan. Coba lagi dalam ${retryAfter} detik.`
            : (result.message ?? 'Terlalu banyak percobaan. Coba lagi setelah jeda.')
        );
        return;
      }
      if (!response.ok) throw new Error(result.message ?? 'Email/username atau password salah.');
      if (result.data?.accountType !== 'ADMIN') {
        throw new Error('Login pelanggan belum tersedia.');
      }
      const accountType = 'ADMIN';
      setSessionType(accountType);
      window.dispatchEvent(new CustomEvent(sessionEstablishedEvent, { detail: accountType }));
      router.replace(query.get('next')?.startsWith('/admin') ? query.get('next')! : '/admin');
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Username/email atau password salah, atau layanan sedang tidak tersedia.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Username atau email</span>
          <span className={styles.inputWrap}>
            <IconUser aria-hidden="true" />
            <input
              autoComplete="username"
              name="identifier"
              type="text"
              placeholder="Username atau kamu@email.com"
              required
            />
          </span>
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <span className={styles.inputWrap}>
            <IconLock aria-hidden="true" />
            <input
              autoComplete="current-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </span>
        </label>
        <AuthSubmit disabled={busy}>{busy ? 'Memeriksa…' : 'Masuk'}</AuthSubmit>
        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}
      </form>
    </>
  );
}
