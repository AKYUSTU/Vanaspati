import styles from './CultivationCards.module.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonths(value) {
  if (!value) return 'Not specified';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    // If elements are numbers (1-12), convert to month names
    return value.map(m => typeof m === 'number' ? (MONTH_NAMES[m - 1] || m) : m).join(', ') || 'Not specified';
  }
  return String(value);
}

function formatList(value) {
  if (!value) return 'Not specified';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map(v => (typeof v === 'object' && v !== null) ? (v.name || v.partName || JSON.stringify(v)) : v).join(', ') || 'Not specified';
  }
  return String(value);
}

export default function CultivationCards({ plant }) {
  const cards = [
    ['Plant Type', plant?.plantType || 'Not specified'],
    ['Native Region', plant?.nativeRegion || 'Not specified'],
    ['Harvest Months', formatMonths(plant?.harvestMonths)],
    ['Bloom Months', formatMonths(plant?.bloomMonths)],
    ['Main Parts Used', formatList(plant?.partsUsed)],
    ['Body Systems', formatList(plant?.bodyParts)],
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
