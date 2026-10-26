import './globals.css';
import 'rangkaui/style.css';
import styles from './layout.module.css';

import type { Metadata, Viewport } from 'next';
import { AppProviders } from '@contexts/appProviders.context';
import { AuthSessionRefresher } from '@features/Auth/organisms/AuthSessionRefresher.organism';
import { USE_MOCK_API } from '@configs/base.config';

export const metadata: Metadata = {
  title: 'JokiHub',
  description: 'Top up game dan layanan joki terpercaya di JokiHub.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className={styles.html}>
      <body className={styles.body}>
        {USE_MOCK_API && (
          <div className={styles.mockDataBanner} role="status">
            Mode demo aktif · Data contoh tidak tersimpan setelah aplikasi dimuat ulang.
          </div>
        )}
        <AppProviders>
          <AuthSessionRefresher />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
