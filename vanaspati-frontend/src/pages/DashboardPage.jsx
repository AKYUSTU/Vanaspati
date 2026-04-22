import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProgressRing from '../components/common/ProgressRing';
import { clearViewHistory, fetchBookmarks, fetchMe, fetchPointsHistory, fetchViewHistory } from '../api/user';
import styles from './DashboardPage.module.css';

function initialsFromName(name) {
  if (!name) return 'VG';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'VG';
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const token = window.localStorage.getItem('vanaspati_token');
  const isAuthenticated = Boolean(token);
  const queryClient = useQueryClient();

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled: isAuthenticated,
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['dashboard-bookmarks'],
    queryFn: fetchBookmarks,
    enabled: isAuthenticated,
  });

  const { data: viewHistory = [] } = useQuery({
    queryKey: ['dashboard-view-history'],
    queryFn: fetchViewHistory,
    enabled: isAuthenticated,
  });

  const { data: pointsHistory = [] } = useQuery({
    queryKey: ['dashboard-points-history'],
    queryFn: fetchPointsHistory,
    enabled: isAuthenticated,
  });

  const clearHistoryMutation = useMutation({
    mutationFn: clearViewHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-view-history'] });
    },
  });

  const levelTarget = useMemo(() => {
    const points = me?.points || 0;
    if (points >= 600) return 600;
    if (points >= 300) return 600;
    if (points >= 150) return 300;
    if (points >= 50) return 150;
    return 50;
  }, [me?.points]);

  if (!isAuthenticated) {
    return (
      <main className={styles.guestState}>
        <h1>Your Dashboard</h1>
        <p>Please sign in to see your bookmarks, history, and learning progress.</p>
      </main>
    );
  }

  return (
    <main className={styles.root}>
      <aside className={styles.sidebar}>
        <h3 className={styles.initials}>{initialsFromName(me?.name)}</h3>
        <p className={styles.meta}>{me?.name || 'Vanaspati Member'}</p>
        <p className={styles.meta}>{me?.email || '-'}</p>
        <ProgressRing value={me?.points || 0} total={levelTarget} />
        <p className={styles.level}>Level: {me?.level || 'SEED'} - {me?.points || 0} pts</p>
      </aside>

      <section className={styles.content}>
        <article className={styles.card}>
          <h2>My Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p className={styles.empty}>No bookmarks yet. Save plants from the plant detail page.</p>
          ) : (
            <ul className={styles.list}>
              {bookmarks.slice(0, 8).map((item) => (
                <li key={item.id} className={styles.row}>
                  <span>{item.commonName}</span>
                  <small>{item.scientificName}</small>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className={styles.card}>
          <div className={styles.headingRow}>
            <h2>View History</h2>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending || viewHistory.length === 0}
            >
              Clear
            </button>
          </div>
          {viewHistory.length === 0 ? (
            <p className={styles.empty}>No viewed plants yet.</p>
          ) : (
            <ul className={styles.list}>
              {viewHistory.slice(0, 8).map((item) => (
                <li key={item.id} className={styles.row}>
                  <span>{item.commonName}</span>
                  <small>{formatDate(item.viewedAt)}</small>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className={styles.card}>
          <h2>Points Timeline</h2>
          {pointsHistory.length === 0 ? (
            <p className={styles.empty}>No points earned yet. Explore plants and complete quizzes.</p>
          ) : (
            <ul className={styles.list}>
              {pointsHistory.slice(0, 8).map((item) => (
                <li key={item.id} className={styles.row}>
                  <span>{item.action || 'Activity'}</span>
                  <small>+{item.points || 0} pts</small>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}
