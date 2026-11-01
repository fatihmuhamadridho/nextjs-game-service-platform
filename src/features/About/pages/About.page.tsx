'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@services/apiFetch.service';
import { withCurrentBrandName } from '@utils/display-brand';
import {
  IconArrowRight,
  IconBolt,
  IconDeviceGamepad2,
  IconHeartHandshake,
  IconShieldCheck,
  IconSparkles,
  IconTargetArrow,
  IconUsers,
} from '@tabler/icons-react';
import { Header } from '@common-ui/organisms/Header/Header';
import { Footer } from '@common-ui/organisms/Footer/Footer';
import Link from 'next/link';
import styles from './About.module.css';

const values = [
  {
    title: 'Cepat dan praktis',
    description: 'Bantu pemain menemukan layanan game dan melakukan pemesanan dengan langkah yang jelas.',
    icon: <IconBolt />,
  },
  {
    title: 'Mengutamakan keamanan',
    description: 'Kami mengingatkan pemain untuk menjaga data akun dan tidak membagikan password atau OTP.',
    icon: <IconShieldCheck />,
  },
  {
    title: 'Dibuat untuk gamers',
    description: 'Pengalaman disusun agar informasi game dan layanan mudah ditemukan di desktop maupun mobile.',
    icon: <IconDeviceGamepad2 />,
  },
];

type AboutContent = { title: string; summary: string; content: string };

export const AboutPage = () => {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    void apiRequest<{ page: AboutContent }>('/api/pages/v1/tentang-kami', { cache: 'no-store' })
      .then((data) => {
        if (alive) {
          setAbout({
            title: withCurrentBrandName(data.page.title),
            summary: withCurrentBrandName(data.page.summary),
            content: withCurrentBrandName(data.page.content),
          });
        }
      })
      .catch((cause: unknown) => {
        if (alive) setError(cause instanceof Error ? cause.message : 'Informasi halaman belum tersedia.');
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className={styles.page}>
    <Header />
    <div className={styles.content}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>
        <b>Tentang Kami</b>
      </nav>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            <IconSparkles /> {about?.title ?? 'Tentang bongastore'}
          </span>
          <h1>
            Satu tempat untuk
            <br />
            kebutuhan <span>gaming</span> kamu.
          </h1>
          <p role={error ? 'alert' : undefined}>{about?.summary ?? error}</p>
          <Link href="/games" className={styles.primary}>
            Jelajahi Game <IconArrowRight />
          </Link>
        </div>
        <div className={styles.art} aria-hidden="true">
          <span className={styles.artGlow} />
          <span className={styles.diamond}>
            <IconDeviceGamepad2 />
          </span>
          <span className={styles.orbit} />
          <span className={styles.spark}>✦</span>
        </div>
      </section>

      <section className={styles.story}>
        <div>
          <span className={styles.sectionLabel}>
            <IconHeartHandshake /> Cerita Kami
          </span>
          <h2>Pengalaman gaming yang lebih mudah dimulai dari sini.</h2>
        </div>
        <div className={styles.storyCopy}>
          <p role={error ? 'alert' : undefined}>{about?.content ?? (error || 'Memuat informasi bongastore…')}</p>
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.missionIcon}>
          <IconTargetArrow />
        </div>
        <div>
          <span>Tujuan Kami</span>
          <h2>Membuat layanan gaming terasa mudah dijelajahi dan dipahami.</h2>
          <p>
            Kami ingin setiap pemain bisa menemukan informasi layanan dengan jelas, tahu langkah berikutnya, dan memesan
            dengan nyaman.
          </p>
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionLabel}>Prinsip Kami</span>
            <h2>Hal yang kami utamakan</h2>
            <p>Nilai yang menjadi arah dalam merancang pengalaman bongastore.</p>
          </div>
        </div>
        <div className={styles.valueGrid}>
          {values.map((value) => (
            <article key={value.title} className={styles.valueCard}>
              <span>{value.icon}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.contact}>
        <div className={styles.contactIcon}>
          <IconUsers />
        </div>
        <div>
          <h2>Ada pertanyaan atau masukan?</h2>
          <p>Tim bantuan dan informasi kontak akan ditampilkan di sini setelah detail resmi tersedia.</p>
        </div>
          <Link href="/cek-pesanan">
          Cek Pesanan <IconArrowRight />
          </Link>
      </section>
    </div>
    <Footer />
  </main>
  );
};
