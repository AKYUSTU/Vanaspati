import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import { getPlantDisplayImage } from '../../utils/plantFallbacks';

export default function QuickViewModal({ plant, onClose }) {
  const slug = plant?.commonName
    ? encodeURIComponent(plant.commonName.toLowerCase().replace(/\s+/g, '-'))
    : 'plant';

  return (
    <Modal open={Boolean(plant)} onClose={onClose} title={plant?.commonName || 'Quick View'}>
      {plant && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <img
            src={getPlantDisplayImage(plant)}
            alt={plant.commonName}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&fit=crop';
            }}
          />
          <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {plant.scientificName}
          </p>
          <p style={{ margin: 0, color: 'var(--text-soft)', lineHeight: 1.5, fontSize: '0.95rem' }}>
            {plant.description || 'A medicinal plant with valued traditional uses in AYUSH systems.'}
          </p>
          {plant.id && !plant.id.startsWith('fallback') && (
            <Link
              to={`/plants/${plant.id}/${slug}`}
              onClick={onClose}
              style={{
                display: 'inline-block',
                padding: '0.65rem 1.25rem',
                background: 'var(--forest-light)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
            >
              View Full Profile →
            </Link>
          )}
        </div>
      )}
    </Modal>
  );
}
