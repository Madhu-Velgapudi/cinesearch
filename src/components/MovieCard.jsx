import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { getPosterUrl, getRatingColor } from '../utils/helpers';
import styles from './MovieCard.module.css';

export default function MovieCard({ movie, index = 0 }) {
  const navigate = useNavigate();
  const { addMovie, removeMovie, isInWatchlist } = useWatchlist();
  const { toast } = useToast();
  const [hovered, setHovered] = useState(false);
  const inList = isInWatchlist(movie.Title || movie.title);

  function handleWatchlist(e) {
    e.stopPropagation();
    try {
      if (inList) { removeMovie(movie.Title || movie.title); toast.info('Removed from watchlist'); }
      else        { addMovie(movie); toast.success('Added to watchlist ❤️'); }
    } catch (err) { toast.error(err.message); }
  }

  const title  = movie.Title  || movie.title;
  const year   = movie.Year   || movie.year;
  const poster = movie.Poster || movie.poster;
  const rating = movie.imdbRating || movie.rating;

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={() => navigate(`/movie/${encodeURIComponent(title)}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.posterWrap}>
        <img src={getPosterUrl(poster)} alt={title} className={styles.poster} loading="lazy" />
        <div className={styles.overlay}>
          <button className={styles.viewBtn}>View Details</button>
        </div>
        <button className={`${styles.heartBtn} ${inList ? styles.active : ''}`} onClick={handleWatchlist}>
          {inList ? '❤️' : '🤍'}
        </button>
        {rating && rating !== 'N/A' && (
          <span className={styles.ratingBadge} style={{ color: getRatingColor(rating) }}>
            ⭐ {parseFloat(rating).toFixed(1)}
          </span>
        )}
      </div>
      <div className={styles.info}>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.meta}>
          {year && <span>{year}</span>}
          {movie.Genre && <span className={styles.genre}>{movie.Genre.split(',')[0]}</span>}
        </div>
      </div>
    </div>
  );
}