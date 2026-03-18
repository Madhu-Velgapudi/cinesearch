import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { getPosterUrl, getRatingColor, timeAgo } from '../utils/helpers';
import styles from './WatchlistPage.module.css';

export default function WatchlistPage() {
  const { watchlist, removeMovie, toggleWatched } = useWatchlist();
  const { toast } = useToast();
  const navigate  = useNavigate();
  const [filter, setFilter] = useState('all'); // all | watched | unwatched

  function handleRemove(e, title) {
    e.stopPropagation();
    removeMovie(title);
    toast.info('Removed from watchlist');
  }

  function handleToggle(e, title) {
    e.stopPropagation();
    toggleWatched(title);
    const movie = watchlist.find(m => m.title === title);
    toast.success(movie?.watched ? 'Marked as unwatched' : 'Marked as watched ✓');
  }

  const filtered = watchlist.filter(m => {
    if (filter === 'watched')   return m.watched;
    if (filter === 'unwatched') return !m.watched;
    return true;
  });

  const watchedCount   = watchlist.filter(m => m.watched).length;
  const unwatchedCount = watchlist.length - watchedCount;

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Watchlist</h1>
            <p className={styles.subtitle}>
              {watchlist.length} movies · {watchedCount} watched · {unwatchedCount} to watch
            </p>
          </div>
          {watchlist.length > 0 && (
            <div className={styles.filterTabs}>
              {[['all','All'], ['unwatched','To Watch'], ['watched','Watched']].map(([v, l]) => (
                <button
                  key={v}
                  className={`${styles.filterTab} ${filter === v ? styles.activeFilter : ''}`}
                  onClick={() => setFilter(v)}
                >{l}</button>
              ))}
            </div>
          )}
        </div>

        {/* Empty state */}
        {watchlist.length === 0 && (
          <div className={styles.empty}>
            <span>🎬</span>
            <h2>Your watchlist is empty</h2>
            <p>Search for movies and add them to your watchlist</p>
            <button className={styles.searchBtn} onClick={() => navigate('/home')}>
              Browse Movies →
            </button>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((movie, i) => (
              <div
                key={movie.title}
                className={`${styles.card} ${movie.watched ? styles.watchedCard : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/movie/${encodeURIComponent(movie.title)}`)}
              >
                <div className={styles.posterWrap}>
                  <img src={getPosterUrl(movie.poster)} alt={movie.title} className={styles.poster} />
                  {movie.watched && <div className={styles.watchedBadge}>✓ Watched</div>}
                  {movie.rating && movie.rating !== 'N/A' && (
                    <span className={styles.rating} style={{ color: getRatingColor(movie.rating) }}>
                      ⭐ {parseFloat(movie.rating).toFixed(1)}
                    </span>
                  )}
                </div>

                <div className={styles.info}>
                  <h4 className={styles.movieTitle}>{movie.title}</h4>
                  {movie.year && <p className={styles.year}>{movie.year}</p>}
                  <p className={styles.addedAt}>Added {timeAgo(movie.addedAt)}</p>

                  <div className={styles.actions}>
                    <button
                      className={`${styles.toggleBtn} ${movie.watched ? styles.watchedToggle : ''}`}
                      onClick={(e) => handleToggle(e, movie.title)}
                    >
                      {movie.watched ? '↩ Unwatch' : '✓ Watched'}
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => handleRemove(e, movie.title)}
                    >✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && watchlist.length > 0 && (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>No movies in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}