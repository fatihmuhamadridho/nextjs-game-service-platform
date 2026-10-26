import { IconDeviceGamepad2, IconSearch, IconShoppingCart, IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import styles from './MobileNavigation.module.css';
export const MobileNavigation = () => (
  <nav className={styles.nav} aria-label="Navigasi bawah">
    <Link href="/">
      <IconDeviceGamepad2 />
      <small>Beranda</small>
    </Link>
    <Link href="/#kategori">
      <IconSearch />
      <small>Layanan</small>
    </Link>
    <Link className={styles.current} href="/games">
      <IconDeviceGamepad2 />
      <small>Game</small>
    </Link>
    <a href="#pesanan">
      <IconShoppingCart />
      <small>Pesanan</small>
    </a>
    <a href="#akun">
      <IconUser />
      <small>Akun</small>
    </a>
  </nav>
);
