import { useMemo, useState } from 'react';
import { usePlants } from '../hooks/usePlants';
import useFilterStore from '../store/filterStore';
import FilterSidebar from '../components/plants/FilterSidebar';
import PlantGrid from '../components/plants/PlantGrid';
import ActiveFilterPills from '../components/plants/ActiveFilterPills';
import { getFallbackPlants } from '../utils/plantFallbacks';
import styles from './PlantsPage.module.css';

export default function PlantsPage() {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 40;

  const filters = useFilterStore((state) => state.filters);
  const queryFilters = useMemo(
    () => ({ page, size: PAGE_SIZE, sort: 'commonName', ...filters }),
    [filters, page]
  );
  const { data } = usePlants(queryFilters);
  const livePlants = data?.content || [];

  const plants = useMemo(() => {
    if (livePlants.length > 0) return livePlants;
    let fallback = getFallbackPlants(20);
    if (filters.q) {
      const query = filters.q.toLowerCase();
      fallback = fallback.filter(p => p.commonName.toLowerCase().includes(query) || p.scientificName.toLowerCase().includes(query));
    }
    if (filters.ailment) fallback = fallback.filter(p => p.bodyParts?.some(b => b.toLowerCase().includes(filters.ailment.toLowerCase())));
    if (filters.system) fallback = fallback.filter(p => p.system?.toLowerCase() === filters.system.toLowerCase());
    if (filters.type) fallback = fallback.filter(p => p.type?.toLowerCase() === filters.type.toLowerCase());
    if (filters.region) fallback = fallback.filter(p => p.region?.toLowerCase() === filters.region.toLowerCase());
    if (filters.partUsed) fallback = fallback.filter(p => p.partUsed?.toLowerCase() === filters.partUsed.toLowerCase());
    if (filters.rasa) fallback = fallback.filter(p => p.rasa?.toLowerCase() === filters.rasa.toLowerCase());
    if (filters.season) fallback = fallback.filter(p => p.season?.toLowerCase() === filters.season.toLowerCase());
    return fallback;
  }, [livePlants, filters]);

  const total = data?.totalElements ?? plants.length;
  const totalPages = data?.totalPages ?? 1;
  const isLive = livePlants.length > 0;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={styles.layout}>
      <FilterSidebar />
      <section>
        <ActiveFilterPills />
        <p className={styles.summary}>
          {isLive
            ? `Showing ${plants.length} of ${total} plants${totalPages > 1 ? ` — Page ${page + 1} of ${totalPages}` : ''}`
            : `Showing ${plants.length} curated plants while the live catalog is unavailable`}
        </p>
        <PlantGrid plants={plants} />

        {isLive && totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Plant catalog pages">
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              ← Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.pageBtn} ${i === page ? styles.pageBtnActive : ''}`}
                onClick={() => handlePageChange(i)}
                aria-current={i === page ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next →
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
