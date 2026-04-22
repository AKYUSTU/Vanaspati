import { Link } from 'react-router-dom';
import AyushBadge from './AyushBadge';
import styles from './PlantCard.module.css';
import { getPlantDisplayImage } from '../../utils/plantFallbacks';

export default function PlantCard({ plant }) {
  const slug = plant?.commonName
    ? encodeURIComponent(plant.commonName.toLowerCase().replace(/\s+/g, '-'))
    : 'plant';
  const href = plant?.id ? `/plants/${plant.id}/${slug}` : '#';

  return (
    <Link to={href} className={styles.card} aria-label={`View ${plant?.commonName || 'plant'} details`}>
      <div className={styles.imageWrap}>
        <img
          src={getPlantDisplayImage(plant)}
          alt={plant?.commonName || 'Plant'}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&fit=crop';
          }}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <AyushBadge system="AYURVEDA" icon="AY" />
        <h3>{plant?.commonName || 'Plant Name'}</h3>
        <p className={styles.scientificName}><em>{plant?.scientificName || 'Scientific name'}</em></p>
        {plant?.description && (
          <p className={styles.desc}>{plant.description.slice(0, 80)}{plant.description.length > 80 ? '...' : ''}</p>
        )}
      </div>
    </Link>
  );
}
