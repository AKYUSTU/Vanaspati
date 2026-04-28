import { getGrowingLocations } from '../../utils/plantLocations';
import styles from './GrowingRegions.module.css';

const REGION_ICONS = {
  'Kerala':           '🌴',
  'Tamil Nadu':       '🌺',
  'Kashmir':          '🏔️',
  'Uttarakhand':      '🏔️',
  'Himachal Pradesh': '🏔️',
  'Rajasthan':        '🏜️',
  'Gujarat':          '🌵',
  'Europe':           '🌍',
  'Mediterranean':    '🌍',
  'North America':    '🌎',
  'Nepal':            '🏔️',
  'Sri Lanka':        '🌊',
  'Afghanistan':      '🏜️',
  'Sikkim':           '🏔️',
  'Assam':            '🍃',
  'Manipur':          '🍃',
};

function getIcon(place) {
  for (const [key, icon] of Object.entries(REGION_ICONS)) {
    if (place.includes(key)) return icon;
  }
  return '📍';
}

export default function GrowingRegions({ commonName, nativeRegion }) {
  const locations = getGrowingLocations(commonName, nativeRegion);

  return (
    <section className={styles.wrap}>
      <h3 className={styles.heading}>
        <span className={styles.headingIcon}>🌿</span>
        Where It Grows
      </h3>
      <p className={styles.sub}>
        Native to <strong>{nativeRegion || 'India'}</strong> · Found across these regions:
      </p>
      <div className={styles.grid}>
        {locations.map((place) => (
          <div key={place} className={styles.card}>
            <span className={styles.icon}>{getIcon(place)}</span>
            <span className={styles.label}>{place}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
