import styles from './CultivationCards.module.css';

export default function CultivationCards({ plant }) {
  const cards = [
    ['Plant Type', plant?.plantType || 'Not specified'],
    ['Native Region', plant?.nativeRegion || 'Not specified'],
    ['Harvest Months', plant?.harvestMonths || 'Not specified'],
    ['Bloom Months', plant?.bloomMonths || 'Not specified'],
    ['Main Parts Used', plant?.partsUsed || 'Not specified'],
    ['Body Systems', plant?.bodyParts || 'Not specified'],
  ];

  return (
    <div className={styles.grid}>
      {cards.map(([label, value]) => (
        <article key={label} className={styles.card}>
          <h4 className={styles.label}>{label}</h4>
          <p className={styles.value}>{value}</p>
        </article>
      ))}
    </div>
  );
}
