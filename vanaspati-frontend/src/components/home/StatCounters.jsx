import styles from './StatCounters.module.css';

const stats = [
  { value: '350+', label: 'Medicinal Plants', icon: '🌿' },
  { value: '5', label: 'AYUSH Systems', icon: '☯️' },
  { value: '500+', label: 'Traditional Remedies', icon: '🧪' },
  { value: '12+', label: 'Body Systems', icon: '🧬' },
  { value: '10,000+', label: 'Active Users', icon: '👥' },
];

export default function StatCounters() {
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
