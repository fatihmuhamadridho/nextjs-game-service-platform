import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Pulihkan Password | bongastore',
  description: 'Pulihkan akses ke akun bongastore kamu.',
};

export default function ForgotPasswordRoute(): never {
  redirect('/login');
}
