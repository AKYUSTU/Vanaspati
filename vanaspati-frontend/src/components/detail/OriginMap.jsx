import styles from './OriginMap.module.css';

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function OriginMap({ nativeRegion, nativeLat, nativeLng }) {
  const lat = toNumber(nativeLat);
  const lng = toNumber(nativeLng);
  const hasCoords = lat !== null && lng !== null;

  const mapsQuery = hasCoords ? `${lat},${lng}` : nativeRegion || 'India';
  const mapsZoom  = hasCoords ? 6 : 4;

  return (
    <section className={styles.wrap}>
      <div className={styles.map}>
        <iframe
          title="Plant Origin Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=${encodeURIComponent(mapsQuery)}&t=p&z=${mapsZoom}&ie=UTF8&iwloc=B&output=embed`}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <strong>Native Region:</strong> {nativeRegion || 'Unknown region'}
          <div className={styles.coords}>
            {hasCoords
              ? `📍 ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`
              : 'Exact coordinates unavailable'}
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
          target="_blank"
          rel="noreferrer"
          className={styles.mapLink}
        >
          Open in Maps ↗
        </a>
      </div>
    </section>
  );
}
