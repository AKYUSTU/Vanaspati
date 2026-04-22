import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchAilments } from '../api/ailments';
import styles from './AilmentsPage.module.css';

import { FALLBACK_AILMENTS } from '../utils/ailmentFallbacks';

export default function AilmentsPage() {
  const { data: liveAilments, isLoading } = useQuery({
    queryKey: ['ailments'],
    queryFn: fetchAilments,
    retry: 1,
  });

  const isUsingFallback = !liveAilments && !isLoading;
  const ailments = liveAilments?.length > 0 ? liveAilments : (isLoading ? [] : FALLBACK_AILMENTS);

  return (
    <main className={styles.root}>
      <div className={styles.pageHeader}>
        <p className={styles.eyebrow}>AYUSH Wellness</p>
        <h1>Ailment Encyclopedia</h1>
        <p className={styles.lead}>Explore traditional plant-based approaches for common health conditions.</p>
        {isUsingFallback && (
          <p className={styles.fallbackBanner}>📚 Showing curated ailment catalog — live data unavailable.</p>
        )}
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading ailments...</p>
        </div>
      ) : (
        <section className={styles.grid}>
          {ailments.map((ailment) => (
            <article key={ailment.id} className={styles.card}>
              <p className={styles.bodyPart}>{ailment.bodyPart || 'General'}</p>
              <h3>{ailment.name}</h3>
              <p className={styles.desc}>{ailment.description}</p>
              <div className={styles.meta}>
                <span>🌿 {ailment.plantCount || 0} plants</span>
                <span>💊 {ailment.remedyCount || 0} remedies</span>
              </div>
              <Link className={styles.link} to={`/ailments/${ailment.id}`}>
                Explore →
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
