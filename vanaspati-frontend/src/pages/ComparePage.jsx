import { useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getPlant, searchPlants } from '../api/plants';
import {
  DEFAULT_MAX_COMPARE,
  addPlantSelection,
  canAddPlant,
  formatCompareValue,
  getAvailableMatches,
  removePlantSelection,
} from '../utils/compareSelection';
import styles from './ComparePage.module.css';

const MAX_COMPARE = DEFAULT_MAX_COMPARE;

const compareRows = [
  { label: 'Scientific Name', key: 'scientificName' },
  { label: 'Sanskrit Name', key: 'sanskritName' },
  { label: 'Plant Type', key: 'plantType' },
  { label: 'Native Region', key: 'nativeRegion' },
  { label: 'Parts Used', key: 'partsUsed' },
  { label: 'Rasa', key: 'rasa' },
  { label: 'Virya', key: 'virya' },
  { label: 'Vipaka', key: 'vipaka' },
  { label: 'Body Systems', key: 'bodyParts' },
  { label: 'Precautions', key: 'precautions' },
];

export default function ComparePage() {
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: matches = [], isFetching: isSearching } = useQuery({
    queryKey: ['compare-search', query],
    queryFn: () => searchPlants(query.trim()),
    enabled: query.trim().length > 1,
    staleTime: 20_000,
  });

  const detailQueries = useQueries({
    queries: selectedIds.map((id) => ({
      queryKey: ['compare-plant', id],
      queryFn: () => getPlant(id),
      staleTime: 60_000,
    })),
  });

  const selectedPlants = detailQueries.map((queryResult) => queryResult.data).filter(Boolean);

  const canAddMore = canAddPlant(selectedIds, MAX_COMPARE);

  const availableMatches = useMemo(
    () => getAvailableMatches(matches, selectedIds, 8),
    [matches, selectedIds]
  );

  const addPlant = (id) => {
    setSelectedIds((current) => addPlantSelection(current, id, MAX_COMPARE));
    setQuery('');
  };

  const removePlant = (id) => {
    setSelectedIds((current) => removePlantSelection(current, id));
  };

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>Plant toolkit</p>
        <h1>Compare Plants</h1>
        <p>Search and add up to three plants to compare their medicinal profile side by side.</p>
      </section>

      <section className={styles.controls}>
        <label htmlFor="compare-search" className={styles.label}>Add plant to comparison</label>
        <input
          id="compare-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={canAddMore ? 'Type plant name to search' : 'Maximum 3 plants selected'}
          disabled={!canAddMore}
          className={styles.searchInput}
        />
        {query.trim().length > 1 && canAddMore ? (
          <div className={styles.searchBox}>
            {isSearching ? <p className={styles.searchHint}>Searching...</p> : null}
            {!isSearching && availableMatches.length === 0 ? <p className={styles.searchHint}>No matches found.</p> : null}
            {!isSearching
              ? availableMatches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.searchItem}
                  onClick={() => addPlant(item.id)}
                >
                  <span>{item.commonName}</span>
                  <small>{item.scientificName}</small>
                </button>
              ))
              : null}
          </div>
        ) : null}
      </section>

      <section className={styles.selectedStrip}>
        {selectedPlants.length === 0 ? <p className={styles.empty}>Select at least one plant to begin comparison.</p> : null}
        {selectedPlants.map((plant) => (
          <div key={plant.id} className={styles.chip}>
            <span>{plant.commonName}</span>
            <button type="button" onClick={() => removePlant(plant.id)} aria-label={`Remove ${plant.commonName}`}>
              x
            </button>
          </div>
        ))}
      </section>

      <section className={styles.tableWrap} aria-label="Plant comparison table">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Property</th>
              {Array.from({ length: MAX_COMPARE }).map((_, index) => {
                const plant = selectedPlants[index];
                return <th key={`slot-${index}`}>{plant ? plant.commonName : 'Empty slot'}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {Array.from({ length: MAX_COMPARE }).map((_, index) => {
                  const plant = selectedPlants[index];
                  return <td key={`${row.key}-${index}`}>{plant ? formatCompareValue(plant[row.key]) : '-'}</td>;
                })}
              </tr>
            ))}
            <tr>
              <th scope="row">Description</th>
              {Array.from({ length: MAX_COMPARE }).map((_, index) => {
                const plant = selectedPlants[index];
                return (
                  <td key={`description-${index}`}>
                    {plant ? (
                      <p className={styles.description}>{plant.description || 'No description available.'}</p>
                    ) : (
                      '-'
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
