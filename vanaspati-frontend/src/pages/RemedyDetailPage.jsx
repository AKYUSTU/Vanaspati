import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchRemedyById } from '../api/remedy';
import { enrichRemedy } from '../utils/remedyEnrichment';
import styles from './RemedyDetailPage.module.css';

export default function RemedyDetailPage() {
  const { id } = useParams();
  const { data: rawRemedy, isLoading, error } = useQuery({
    queryKey: ['remedy-detail', id],
    queryFn: () => fetchRemedyById(id),
  });

  // Enrich sparse DB content with detailed descriptions and steps
  const remedy = enrichRemedy(rawRemedy);

  if (isLoading) {
    return <main className={styles.container}><p>Loading remedy details...</p></main>;
  }

  if (error) {
    return (
      <main className={styles.container}>
        <p className={styles.error}>Failed to load remedy. {error.message}</p>
      </main>
    );
  }

  if (!remedy) {
    return (
      <main className={styles.container}>
        <p>Remedy not found.</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Link to="/remedies" className={styles.backLink}>
        ← Back to Remedies
      </Link>

      <article className={styles.detailCard}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1>{remedy.name}</h1>
            {remedy.difficulty && (
              <span className={`${styles.difficulty} ${styles[`difficulty${remedy.difficulty}`]}`}>
                {remedy.difficulty}
              </span>
            )}
          </div>

          <div className={styles.meta}>
            {remedy.forAilment && (
              <div className={styles.metaItem}>
                <span className={styles.label}>For:</span>
                <span className={styles.value}>{remedy.forAilment}</span>
              </div>
            )}
            {remedy.prepTimeMinutes && (
              <div className={styles.metaItem}>
                <span className={styles.label}>Prep Time:</span>
                <span className={styles.value}>{remedy.prepTimeMinutes} minutes</span>
              </div>
            )}
            {remedy.ratingAvg && (
              <div className={styles.metaItem}>
                <span className={styles.label}>Rating:</span>
                <span className={styles.value}>⭐ {remedy.ratingAvg.toFixed(1)} ({remedy.ratingCount})</span>
              </div>
            )}
          </div>
        </div>

        {remedy.description && (
          <section className={styles.section}>
            <h2>About This Remedy</h2>
            {remedy.description.split('\n\n').map((para, i) => (
              <p key={i} className={styles.description}>{para.trim()}</p>
            ))}
          </section>
        )}

        {remedy.ingredients && remedy.ingredients.length > 0 && (
          <section className={styles.section}>
            <h2>Ingredients</h2>
            <ul className={styles.ingredientList}>
              {remedy.ingredients.map((ing) => (
                <li key={ing.id} className={styles.ingredientItem}>
                  <div className={styles.ingredientName}>{ing.ingredientName}</div>
                  {ing.quantity && <span className={styles.quantity}>{ing.quantity}</span>}
                  {ing.plantName && <span className={styles.plantReference}>({ing.plantName})</span>}
                  {ing.notes && <p className={styles.notes}>{ing.notes}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {remedy.steps && remedy.steps.length > 0 && (
          <section className={styles.section}>
            <h2>Instructions</h2>
            <ol className={styles.stepsList}>
              {remedy.steps.map((step) => (
                <li key={step.id} className={styles.stepItem}>
                  <span className={styles.stepNumber}>{step.stepNumber}</span>
                  <span className={styles.stepText}>{step.instruction}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {remedy.precautions && (
          <section className={`${styles.section} ${styles.precautions}`}>
            <h2>⚠️ Precautions</h2>
            <p>{remedy.precautions}</p>
          </section>
        )}
      </article>
    </main>
  );
}
