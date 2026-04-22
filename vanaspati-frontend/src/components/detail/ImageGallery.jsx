import { useMemo, useState } from 'react';
import { normalizeImageList } from '../../utils/plantData';
import { buildBotanicalFallbackImage } from '../../utils/plantFallbacks';
import styles from './ImageGallery.module.css';

export default function ImageGallery({ mainImageUrl, galleryImages, commonName }) {
  const images = useMemo(
    () => normalizeImageList(mainImageUrl, galleryImages),
    [mainImageUrl, galleryImages]
  );
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImages = images.length > 0;
  const fallbackImage = useMemo(() => buildBotanicalFallbackImage(commonName || 'Plant detail'), [commonName]);
  const activeImage = hasImages ? images[Math.min(selected, images.length - 1)] : fallbackImage;

  const move = (delta) => {
    if (!images.length) return;
    setSelected((prev) => {
      const next = (prev + delta + images.length) % images.length;
      return next;
    });
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className={styles.mainButton}
      >
        <img
          src={activeImage}
          alt="Plant"
          className={styles.mainImage}
          loading="lazy"
        />
      </button>

      {images.length > 1 && (
        <div className={styles.thumbGrid}>
          {images.map((src, idx) => (
            <button
              type="button"
              key={`${src}-${idx}`}
              onClick={() => setSelected(idx)}
              className={`${styles.thumbBtn} ${idx === selected ? styles.active : ''}`}
            >
              <img
                src={src}
                alt={`Plant detail ${idx + 1}`}
                className={styles.thumbImage}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
          className={styles.overlay}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.dialog}
          >
            <img
              src={activeImage}
              alt="Expanded plant visual"
              className={styles.lightboxImage}
            />
            <div className={styles.controls}>
              <button type="button" onClick={() => move(-1)} className={styles.controlBtn}>
                Previous
              </button>
              <button type="button" onClick={() => setLightboxOpen(false)} className={styles.controlBtn}>
                Close
              </button>
              <button type="button" onClick={() => move(1)} className={styles.controlBtn}>
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
