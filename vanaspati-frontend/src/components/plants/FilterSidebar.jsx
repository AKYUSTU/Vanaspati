import useFilterStore from '../../store/filterStore';
import styles from './FilterSidebar.module.css';

export default function FilterSidebar() {
  const { filters, setFilter, resetFilters } = useFilterStore();

  return (
    <aside className={styles.sidebar}>
      <h3>Filters</h3>
      <input
        value={filters.q}
        onChange={(e) => setFilter('q', e.target.value)}
        placeholder="Search plants"
        aria-label="Search plants"
      />
      <select value={filters.system} onChange={(e) => setFilter('system', e.target.value)}>
        <option value="">All Systems</option>
        <option value="AYURVEDA">Ayurveda</option>
        <option value="YOGA">Yoga</option>
        <option value="UNANI">Unani</option>
        <option value="SIDDHA">Siddha</option>
        <option value="HOMEOPATHY">Homeopathy</option>
      </select>
      <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
        <option value="">All Plant Types</option>
        <option value="TREE">Tree</option>
        <option value="SHRUB">Shrub</option>
        <option value="HERB">Herb</option>
        <option value="CLIMBER">Climber</option>
        <option value="GRASS">Grass</option>
      </select>
      <select value={filters.region} onChange={(e) => setFilter('region', e.target.value)}>
        <option value="">All Regions</option>
        <option value="North India">North India</option>
        <option value="South India">South India</option>
        <option value="Himalayan">Himalayan</option>
        <option value="Coastal">Coastal</option>
        <option value="Pan-India">Pan-India</option>
      </select>
      <button type="button" onClick={resetFilters}>Reset All Filters</button>
    </aside>
  );
}
