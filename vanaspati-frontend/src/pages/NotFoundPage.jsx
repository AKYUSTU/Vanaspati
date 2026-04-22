import { Link } from 'react-router-dom';
import styles from './PageStub.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="not-found-title">
        <div className={styles.badge}>404</div>
        <svg className={styles.illustration} viewBox="0 0 240 240" aria-hidden="true">
          <circle cx="120" cy="120" r="92" fill="#fbf0d8" />
          <path d="M120 48c18 18 24 42 24 62 0 28-15 58-24 70-9-12-24-42-24-70 0-20 6-44 24-62z" fill="#7baf7b" />
          <path d="M120 74c-18 10-30 25-38 42" stroke="#2c5f3f" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M120 74c18 10 30 25 38 42" stroke="#2c5f3f" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <h1 id="not-found-title" className={styles.title}>This page has grown off the path.</h1>
        <p className={styles.copy}>The route you tried does not exist, but the rest of Vanaspati is still here.</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primaryLink}>Return home</Link>
          <Link to="/plants" className={styles.secondaryLink}>Browse plants</Link>
        </div>
      </section>
    </main>
  );
}
