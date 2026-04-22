import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchRemediesPaged, searchRemedies } from '../api/remedy';
import styles from './RemediesPage.module.css';

import { FALLBACK_REMEDIES } from '../utils/remedyFallbacks';

export default function RemediesPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [difficulty, setDifficulty] = useState('');

  const { data: liveRemedies, isLoading } = useQuery({
    queryKey: searchTerm ? ['remedies-search', searchTerm, pageIndex] : ['remedies-paged', pageIndex, sortBy],
    queryFn: () =>
      searchTerm
        ? searchRemedies(searchTerm, pageIndex, 12)
        : fetchRemediesPaged(pageIndex, 12, sortBy),
    retry: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPageIndex(0);
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setPageIndex(0);
  };

  const isUsingFallback = !liveRemedies && !isLoading;
  const remedyData = liveRemedies || { content: FALLBACK_REMEDIES, totalElements: FALLBACK_REMEDIES.length, totalPages: 1 };

  const filteredRemedies = (remedyData.content || []).filter((remedy) => {
    if (difficulty && remedy.difficulty !== difficulty) return false;
    if (searchTerm && isUsingFallback) {
      const q = searchTerm.toLowerCase();
      return remedy.name.toLowerCase().includes(q) || remedy.forAilment?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <main className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <p className={styles.eyebrow}>AYUSH Knowledge</p>
        <h1>Remedies Library</h1>
        <p className={styles.lead}>Traditional herbal preparations rooted in Ayurvedic, Unani, and Siddha wisdom.</p>
        {isUsingFallback && (
          <p className={styles.fallbackBanner}>📚 Showing curated remedies — live catalog unavailable.</p>
        )}
      </div>

      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search remedies by name or ailment..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
          {searchTerm && (
            <button type="button" onClick={handleResetSearch} className={styles.resetBtn}>
              Reset
            </button>
          )}
        </form>

        <div className={styles.filterRow}>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={styles.filter}>
            <option value="">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPageIndex(0);
            }}
            className={styles.filter}
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading remedies...</p>
        </div>
      ) : filteredRemedies.length === 0 ? (
        <p className={styles.emptyState}>No remedies found. Try adjusting your filters.</p>
      ) : (
        <>
          <section className={styles.remedyGrid}>
            {filteredRemedies.map((remedy) => (
              <article key={remedy.id} className={styles.remedyCard}>
                <div className={styles.cardHeader}>
                  <h3>{remedy.name}</h3>
                  {remedy.difficulty && (
                    <span className={`${styles.difficultyBadge} ${styles[`difficulty${remedy.difficulty}`]}`}>
                      {remedy.difficulty}
                    </span>
                  )}
                </div>

                {remedy.forAilment && <p className={styles.ailment}>🌿 {remedy.forAilment}</p>}

                <p className={styles.description}>
                  {remedy.description?.length > 110 ? `${remedy.description.slice(0, 110)}...` : remedy.description}
                </p>

                <div className={styles.cardMeta}>
                  {remedy.prepTimeMinutes && <span className={styles.prepTime}>⏱ {remedy.prepTimeMinutes} min</span>}
                  {remedy.ratingAvg && (
                    <span className={styles.rating}>
                      ⭐ {typeof remedy.ratingAvg === 'number' ? remedy.ratingAvg.toFixed(1) : remedy.ratingAvg}
                      {remedy.ratingCount ? ` (${remedy.ratingCount})` : ''}
                    </span>
                  )}
                </div>

                <Link to={`/remedies/${remedy.id}`} className={styles.viewBtn}>
                  View Recipe →
                </Link>
              </article>
            ))}
          </section>

          {!isUsingFallback && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                disabled={pageIndex === 0}
                className={styles.paginationBtn}
              >
                ← Previous
              </button>
              <span className={styles.pageInfo}>
                Page {pageIndex + 1} of {remedyData.totalPages || 1}
              </span>
              <button
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={pageIndex >= (remedyData.totalPages || 1) - 1}
                className={styles.paginationBtn}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
