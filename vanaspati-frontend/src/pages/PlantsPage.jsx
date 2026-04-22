import { useMemo } from 'react';
import { usePlants } from '../hooks/usePlants';
import useFilterStore from '../store/filterStore';
import FilterSidebar from '../components/plants/FilterSidebar';
import PlantGrid from '../components/plants/PlantGrid';
import ActiveFilterPills from '../components/plants/ActiveFilterPills';
import { getFallbackPlants } from '../utils/plantFallbacks';
import styles from './PlantsPage.module.css';

export default function PlantsPage() {
  const filters = useFilterStore((state) => state.filters);
  const queryFilters = useMemo(() => ({ page: 0, size: 15, sort: 'commonName', ...filters }), [filters]);
  const { data } = usePlants(queryFilters);
  const livePlants = data?.content || [];
  
  const plants = useMemo(() => {
    if (livePlants.length > 0) return livePlants;
    let fallback = getFallbackPlants(20); // Get all available fallbacks for filtering
    
    // Apply local filters
    if (filters.q) {
      const query = filters.q.toLowerCase();
      fallback = fallback.filter(p => p.commonName.toLowerCase().includes(query) || p.scientificName.toLowerCase().includes(query));
    }
    if (filters.ailment) {
      fallback = fallback.filter(p => p.bodyParts?.some(b => b.toLowerCase().includes(filters.ailment.toLowerCase())));
    }
    if (filters.system) fallback = fallback.filter(p => p.system?.toLowerCase() === filters.system.toLowerCase());
    if (filters.type) fallback = fallback.filter(p => p.type?.toLowerCase() === filters.type.toLowerCase());
    if (filters.region) fallback = fallback.filter(p => p.region?.toLowerCase() === filters.region.toLowerCase());
    if (filters.partUsed) fallback = fallback.filter(p => p.partUsed?.toLowerCase() === filters.partUsed.toLowerCase());
    if (filters.rasa) fallback = fallback.filter(p => p.rasa?.toLowerCase() === filters.rasa.toLowerCase());
    if (filters.season) fallback = fallback.filter(p => p.season?.toLowerCase() === filters.season.toLowerCase());

    return fallback;
  }, [livePlants, filters]);

  const total = data?.totalElements ?? plants.length;

  return (
    <main className={styles.layout}>
      <FilterSidebar />
      <section>
        <ActiveFilterPills />
        <p className={styles.summary}>
          {livePlants.length > 0
            ? `Showing ${plants.length} of ${total} plants`
            : `Showing ${plants.length} curated plants while the live catalog is unavailable`}
        </p>
        <PlantGrid plants={plants} />
      </section>
    </main>
  );
}
