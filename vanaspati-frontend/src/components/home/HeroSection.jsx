import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { searchPlants } from '../../api/plants';
import styles from './HeroSection.module.css';
import LeafParticles from './LeafParticles';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { data = [] } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPlants(query),
    enabled: query.length > 1,
  });
  const results = useMemo(() => data.slice(0, 8), [data]);

  const navigateToSelected = () => {
    const selected = results[selectedIndex] || results[0];
    if (selected?.id) {
      navigate(`/plants/${selected.id}/${encodeURIComponent(selected.commonName.toLowerCase().replace(/\s+/g, '-'))}`);
    }
  };

  const handleKeyDown = (event) => {
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((value) => (value + 1) % results.length);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((value) => (value - 1 + results.length) % results.length);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      navigateToSelected();
    }
    if (event.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <section className={styles.hero}>
      <LeafParticles />
      <div className={styles.texture} />
      <div className={styles.content}>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          Explore 500 Years of Healing Wisdom
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          India's most complete digital encyclopedia of AYUSH medicinal plants
        </motion.p>
        <motion.div className={styles.searchWrap} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search by plant name, ailment, Sanskrit name, or local name..."
            aria-label="Search plants"
            aria-autocomplete="list"
          />
          <button type="button" onClick={navigateToSelected} disabled={!results.length}>
            Search
          </button>
        </motion.div>
        {query.length > 1 && results.length > 0 && (
          <div className={styles.results} role="listbox" aria-live="polite">
            {results.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.resultRow} ${index === selectedIndex ? styles.selected : ''}`}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => navigate(`/plants/${item.id}/${encodeURIComponent(item.commonName.toLowerCase().replace(/\s+/g, '-'))}`)}
              >
                <span>{item.commonName}</span>
                <small>{item.sanskritName || item.scientificName}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
