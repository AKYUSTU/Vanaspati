import { Link } from 'react-router-dom';
import styles from './SeasonalPreview.module.css';

const CURRENT_MONTH = new Date().getMonth(); // 0-indexed

const months = [
  { label: 'Jan', name: 'January', season: 'winter', plants: ['Ginger', 'Tulsi'] },
  { label: 'Feb', name: 'February', season: 'winter', plants: ['Ashwagandha', 'Brahmi'] },
  { label: 'Mar', name: 'March', season: 'spring', plants: ['Amla', 'Neem'] },
  { label: 'Apr', name: 'April', season: 'spring', plants: ['Tulsi', 'Guduchi'] },
  { label: 'May', name: 'May', season: 'summer', plants: ['Bhringraj', 'Licorice'] },
  { label: 'Jun', name: 'June', season: 'summer', plants: ['Ginger', 'Turmeric'] },
  { label: 'Jul', name: 'July', season: 'monsoon', plants: ['Tulsi', 'Guduchi'] },
  { label: 'Aug', name: 'August', season: 'monsoon', plants: ['Neem', 'Amla'] },
  { label: 'Sep', name: 'September', season: 'monsoon', plants: ['Brahmi', 'Shatavari'] },
  { label: 'Oct', name: 'October', season: 'autumn', plants: ['Ashwagandha', 'Turmeric'] },
  { label: 'Nov', name: 'November', season: 'autumn', plants: ['Licorice', 'Ginger'] },
  { label: 'Dec', name: 'December', season: 'winter', plants: ['Tulsi', 'Ashwagandha'] },
];

const seasonColors = {
  winter: '#6b90c4',
  spring: '#6bc49a',
  summer: '#e8a85a',
  monsoon: '#6bafc4',
  autumn: '#c9922a',
};

export default function SeasonalPreview() {
  return (
    <section className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h2>Seasonal Planting Calendar</h2>
          <p className={styles.sub}>Plants curated by the best growing and harvesting times in India.</p>
        </div>
        <Link to="/seasonal-calendar" className={styles.cta}>View Full Calendar →</Link>
      </div>
      <div className={styles.strip}>
        {months.map((m, i) => (
          <div
            key={m.name}
            className={`${styles.month} ${i === CURRENT_MONTH ? styles.current : ''}`}
            title={`${m.name}: ${m.plants.join(', ')}`}
            aria-label={m.name}
          >
            <span className={styles.label}>{m.label}</span>
            <span
              className={styles.dot}
              style={{ background: seasonColors[m.season] }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        {Object.entries(seasonColors).map(([season, color]) => (
          <span key={season} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: color }} />
            {season.charAt(0).toUpperCase() + season.slice(1)}
          </span>
        ))}
      </div>
    </section>
  );
}
