import useFilterStore from '../../store/filterStore';
import styles from './ActiveFilterPills.module.css';

export default function ActiveFilterPills() {
  const { filters, setFilter } = useFilterStore();
  const active = Object.entries(filters).filter(([k, v]) => k !== 'sort' && v);

  if (!active.length) return null;

  return (
    <div className={styles.row}>
      {active.map(([key, value]) => (
        <button key={key} className={styles.pill} onClick={() => setFilter(key, '')}>
          {key}: {value} x
        </button>
      ))}
    </div>
  );
}
