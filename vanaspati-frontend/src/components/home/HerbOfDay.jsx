import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getHerbOfDay } from '../../api/plants';
import { getFallbackHerbOfDay, getPlantDisplayImage } from '../../utils/plantFallbacks';
import styles from './HerbOfDay.module.css';

export default function HerbOfDay() {
  const { data } = useQuery({
    queryKey: ['herb-day'],
    queryFn: getHerbOfDay,
    staleTime: 60_000,
    retry: 1,
  });
  const herb = data?.commonName ? data : getFallbackHerbOfDay();
  const isLive = Boolean(data?.commonName);

  const slug = encodeURIComponent((herb.commonName || 'herb').toLowerCase().replace(/\s+/g, '-'));
  const href = herb.id && !String(herb.id).startsWith('fallback') ? `/plants/${herb.id}/${slug}` : '/plants';

  return (
    <section className={styles.wrap}>
      <p className={styles.eyebrow}>🌿 Herb of the Day</p>
      <article className={styles.card}>
        <div className={styles.imgWrap}>
          <img
            src={getPlantDisplayImage(herb)}
            alt={herb.commonName || 'Herb of the day'}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=80&fit=crop';
            }}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.tags}>
            <span className={styles.tag}>AYURVEDA</span>
            {!isLive && <span className={styles.tagCurated}>Curated</span>}
          </div>
          <h3>{herb.commonName}</h3>
          <p className={styles.scientific}><em>{herb.scientificName}</em></p>
          <p className={styles.desc}>{herb.description}</p>
          <Link to={href} className={styles.cta}>
            Explore plant profile →
          </Link>
        </div>
      </article>
    </section>
  );
}
