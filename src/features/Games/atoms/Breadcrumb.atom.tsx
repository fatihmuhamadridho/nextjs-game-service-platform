import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import styles from './Breadcrumb.module.css';
export const Breadcrumb = () => (
  <nav className={styles.breadcrumb} aria-label="Breadcrumb">
    <Link href="/">Beranda</Link>
    <IconChevronRight />
    <span>Game</span>
  </nav>
);
