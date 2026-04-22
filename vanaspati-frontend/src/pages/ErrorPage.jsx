import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.css';

export default function ErrorPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.badge}>500</p>
        <svg className={styles.illustration} viewBox="0 0 220 220" aria-hidden="true">
          <rect width="220" height="220" rx="40" fill="#e8f4ec" />
          <circle cx="58" cy="68" r="20" fill="#c9922a" />
          <path d="M36 170c20-28 40-42 64-42s44 14 84 42" stroke="#2c5f3f" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M108 122c0 16-12 28-28 28s-28-12-28-28 12-28 28-28" fill="#7baf7b" />
          <path d="M150 120c0 10-8 18-18 18s-18-8-18-18 8-18 18-18 18 8 18 18z" fill="#4a8c5c" />
        </svg>
        <h1>Something went quiet in the garden</h1>
        <p>We are tending to it. Please try again or return to the home page.</p>
        <Link to="/" className={styles.homeLink}>Return home</Link>
      </section>
    </main>
  );
}
