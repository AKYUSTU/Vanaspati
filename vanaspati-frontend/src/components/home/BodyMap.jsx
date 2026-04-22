import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlantsByBodyPart } from '../../api/plants';
import { getFallbackPlantsByBodyPart, getPlantDisplayImage } from '../../utils/plantFallbacks';
import styles from './BodyMap.module.css';

const parts = [
  { key: 'HEAD', label: 'Head & Mind', emoji: '🧠', y: 20 },
  { key: 'EYES', label: 'Eyes', emoji: '👁️', y: 48 },
  { key: 'THROAT', label: 'Throat', emoji: '🗣️', y: 76 },
  { key: 'CHEST', label: 'Chest & Lungs', emoji: '💨', y: 104 },
  { key: 'HEART', label: 'Heart', emoji: '❤️', y: 132 },
  { key: 'LIVER', label: 'Liver', emoji: '🫁', y: 160 },
  { key: 'STOMACH', label: 'Stomach', emoji: '🌀', y: 188 },
  { key: 'KIDNEYS', label: 'Kidneys', emoji: '🫘', y: 216 },
  { key: 'JOINTS', label: 'Joints', emoji: '🦴', y: 244 },
  { key: 'SKIN', label: 'Skin', emoji: '🌿', y: 272 },
];

export default function BodyMap() {
  const [active, setActive] = useState('JOINTS');
  const { data = [] } = useQuery({
    queryKey: ['body-part', active],
    queryFn: () => getPlantsByBodyPart(active),
    retry: 1,
  });
  const livePlants = Array.isArray(data) ? data : [];
  const plants = livePlants.length > 0 ? livePlants : getFallbackPlantsByBodyPart(active);
  const usingFallback = livePlants.length === 0;

  const activePart = parts.find((p) => p.key === active);

  return (
    <section className={styles.wrap}>
      <div className={styles.left}>
        <h2>Interactive Body Map</h2>
        <p className={styles.helper}>
          Tap a region to explore plants commonly associated with that system.
        </p>
        <div className={styles.partsList}>
          {parts.map((part) => (
            <button
              key={part.key}
              type="button"
              data-part={part.key}
              className={`${styles.partBtn} ${active === part.key ? styles.activePart : ''}`}
              onClick={() => setActive(part.key)}
              aria-pressed={active === part.key}
            >
              <span className={styles.partEmoji}>{part.emoji}</span>
              <span className={styles.partLabel}>{part.label}</span>
            </button>
          ))}
        </div>
      </div>
      <aside className={styles.panel}>
        <h3>{activePart?.emoji} {activePart?.label || active} Plants</h3>
        <p className={styles.panelNote}>
          {usingFallback
            ? 'Curated botanical references are shown until the live catalog responds.'
            : `Showing ${plants.length} live matches.`}
        </p>
        <div className={styles.results}>
          {plants.slice(0, 6).map((plant, index) => (
            <article key={plant.id || `${active}-${index}`} className={styles.item}>
              <img className={styles.thumb} src={getPlantDisplayImage(plant, index)} alt={plant.commonName || 'Plant'} loading="lazy" />
              <div className={styles.itemBody}>
                <strong>{plant.commonName}</strong>
                <span>{plant.scientificName || 'Scientific name unavailable'}</span>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}
