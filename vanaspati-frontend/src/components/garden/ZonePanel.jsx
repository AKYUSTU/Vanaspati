import styles from './ZonePanel.module.css';

export default function ZonePanel({
  zone,
  plants,
  searchTerm,
  onSearchTermChange,
  plantSearchResults,
  onAddPlant,
  onRemovePlant,
  onDeleteZone,
  canManage,
  pending,
  onClose,
}) {
  if (!zone) return null;

  return (
    <div className={styles.panel}>
      {/* ← Back button — always visible */}
      <button type="button" onClick={onClose} className={styles.backBtn} aria-label="Back to garden">
        ← Back to Garden
      </button>

      <h3 className={styles.zoneName}>{zone.zoneName}</h3>
      <p className={styles.meta}>{zone.systemName}</p>
      <p className={styles.description}>{zone.description}</p>

      <div className={styles.stats}>Plants in zone: {zone.plantCount ?? plants.length}</div>

      <div className={styles.section}>
        <h4>Assigned Plants</h4>
        {plants?.length ? (
          <ul className={styles.list}>
            {plants.map((plant) => (
              <li key={plant.id} className={styles.listItem}>
                <div>
                  <strong>{plant.commonName}</strong>
                  <div className={styles.scientific}>{plant.scientificName}</div>
                </div>
                {canManage ? (
                  <button type="button" onClick={() => onRemovePlant(plant.id)} disabled={pending}>
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No plants assigned to this zone yet.</p>
        )}
      </div>

      {canManage ? (
        <div className={styles.section}>
          <h4>Add Plants</h4>
          <input
            className={styles.search}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search plant name"
          />
          {searchTerm && plantSearchResults?.length ? (
            <ul className={styles.searchList}>
              {plantSearchResults.slice(0, 8).map((plant) => (
                <li key={`search-${plant.id}`}>
                  <button type="button" onClick={() => onAddPlant(plant.id)} disabled={pending}>
                    + {plant.commonName}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {canManage ? (
        <button type="button" className={styles.deleteZone} onClick={onDeleteZone} disabled={pending}>
          Delete This Zone
        </button>
      ) : (
        <p className={styles.note}>System zones are read-only. Create a personal zone to customize assignments.</p>
      )}
    </div>
  );
}
