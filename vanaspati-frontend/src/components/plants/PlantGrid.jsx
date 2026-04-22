import { useState } from 'react';
import PlantCard from '../common/PlantCard';
import QuickViewModal from './QuickViewModal';
import styles from './PlantGrid.module.css';

export default function PlantGrid({ plants = [] }) {
  const [quickView, setQuickView] = useState(null);

  return (
    <>
      <div className={styles.grid}>
        {plants.map((plant) => (
          <div key={plant.id} className={styles.item}>
            <PlantCard plant={plant} />
            <button className={styles.quick} onClick={() => setQuickView(plant)}>
              Quick View
            </button>
          </div>
        ))}
      </div>
      <QuickViewModal plant={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
