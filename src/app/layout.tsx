import './globals.css';
import 'rangkaui/style.css';
import styles from './layout.module.css';

import type { Metadata, Viewport } from 'next';
import { AppProviders } from '@contexts/appProviders.context';
import { AuthSessionRefresher } from '@features/Auth/organisms/AuthSessionRefresher.organism';

export const metadata: Metadata = {
  title: 'bongastore',
  description: 'Top up game dan layanan joki terpercaya di bongastore.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className={styles.html}>
      <body className={styles.body}>
        <AppProviders>
          <AuthSessionRefresher />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
