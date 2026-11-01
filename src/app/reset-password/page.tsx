import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Atur Password Baru | bongastore',
  description: 'Atur password baru untuk akun bongastore kamu.',
};

export default function ResetPasswordRoute(): never {
  redirect('/login');
}
