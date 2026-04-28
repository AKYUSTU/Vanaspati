import { useEffect, useState } from 'react';
import styles from './StatCounters.module.css';
import client from '../../api/client';

async function fetchLiveStats() {
  const [plantsRes, remediesRes] = await Promise.allSettled([
    client.get('/api/plants?page=0&size=1'),
    client.get('/api/remedies/paged?page=0&size=1'),
  ]);

  const plantCount =
    plantsRes.status === 'fulfilled'
      ? (plantsRes.value.data?.totalElements ?? null)
      : null;

  const remedyCount =
    remediesRes.status === 'fulfilled'
      ? (remediesRes.value.data?.totalElements ?? null)
      : null;

  return { plantCount, remedyCount };
}

export default function StatCounters() {
  const [counts, setCounts] = useState({ plantCount: null, remedyCount: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchLiveStats()
      .then((data) => { setCounts(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const fmt = (n) => (n === null ? (loaded ? '—' : '…') : n.toLocaleString());

  const stats = [
    { value: fmt(counts.plantCount),  label: 'Medicinal Plants',      icon: '🌿' },
    { value: '5',                      label: 'AYUSH Systems',          icon: '☯️' },
    { value: fmt(counts.remedyCount), label: 'Traditional Remedies',   icon: '🧪' },
    { value: '15',                     label: 'Body Systems',           icon: '🧬' },
    { value: 'Growing!',              label: 'Active Users',            icon: '👥' },
  ];

  return (
    <section className={styles.wrap}>
      {stats.map(({ value, label, icon }) => (
        <article key={label} className={styles.card}>
          <span className={styles.icon}>{icon}</span>
          <h3 className={styles.value}>{value}</h3>
          <p className={styles.label}>{label}</p>
        </article>
      ))}
    </section>
  );
}
