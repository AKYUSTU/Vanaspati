import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { fetchAilmentDetail } from '../api/ailments';
import styles from './AilmentDetailPage.module.css';

export default function AilmentDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['ailment-detail', id],
    queryFn: () => fetchAilmentDetail(id),
  });

  if (isLoading) {
    return <main><p>Loading ailment details...</p></main>;
  }

  if (!data) {
    return <main><p>Ailment not found.</p></main>;
  }

  return (
    <main className={styles.root}>
      <Link to="/ailments" className={styles.back}>Back to Ailments</Link>
      <h1>{data.name}</h1>
      <p className={styles.subtitle}>{data.bodyPart || 'General'}</p>
      <p className={styles.desc}>{data.description}</p>

      <section className={styles.section}>
        <h3>Recommended Plants</h3>
        {data.plants?.length ? (
          <div className={styles.grid}>
            {data.plants.map((plant) => (
              <article key={plant.plantId} className={styles.card}>
                <h4>{plant.commonName}</h4>
                <p className={styles.scientific}>{plant.scientificName}</p>
                <p>{plant.howUsed}</p>
                {plant.dosageForm ? <p className={styles.meta}>Dosage: {plant.dosageForm}</p> : null}
                <Link to={`/plants/${plant.plantId}/${encodeURIComponent((plant.commonName || '').toLowerCase())}`} className={styles.link}>
                  View Plant
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.muted}>No linked plants yet.</p>
        )}
      </section>

      <section className={styles.section}>
        <h3>Related Remedies</h3>
        {data.remedies?.length ? (
          <div className={styles.grid}>
            {data.remedies.map((remedy) => (
              <article key={remedy.id} className={styles.card}>
                <h4>{remedy.name}</h4>
                <p>{remedy.description}</p>
                <p className={styles.meta}>{remedy.difficulty} • {remedy.prepTimeMinutes || 0} min</p>
                <Link to={`/remedies/${remedy.id}`} className={styles.link}>View Remedy</Link>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.muted}>No linked remedies yet.</p>
        )}
      </section>
    </main>
  );
}
