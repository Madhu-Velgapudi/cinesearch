import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMovieByTitle } from '../services/omdb';
import { getWikiSummary } from '../services/wikipedia';
import { getStreamingPlatforms } from '../services/watchmode';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { getPosterUrl, formatRuntime, getRatingColor } from '../utils/helpers';
import TrailerModal from '../components/TrailerModal';
import styles from './MovieDetailPage.module.css';

export default function MovieDetailPage() {
  const { title }   = useParams();
  const navigate    = useNavigate();
  const decoded     = decodeURIComponent(title);

  const [movie,     setMovie]     = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [wiki,      setWiki]      = useState(null);
  const [streaming, setStreaming] = useState(null);
  const [loading,   setLoading]   = useState(true);

  const { addMovie, removeMovie, isInWatchlist } = useWatchlist();
  const { toast } = useToast();
  const inList = movie ? isInWatchlist(movie.Title) : false;

  useEffect(() => {
    loadAll();
    window.scrollTo(0, 0);
  }, [decoded]);

  async function loadAll() {
    setLoading(true);
    const [omdb, wikiData] = await Promise.all([
      getMovieByTitle(decoded),
      getWikiSummary(decoded),
    ]);
    setMovie(omdb);
    setWiki(wikiData);
    setLoading(false);

    // streaming in background
    getStreamingPlatforms(decoded).then(setStreaming);
  }

  function handleWatchlist() {
    if (!movie) return;
    try {
      if (inList) { removeMovie(movie.Title); toast.info('Removed from watchlist'); }
      else        { addMovie(movie);           toast.success('Added to watchlist ❤️'); }
    } catch (err) { toast.error(err.message); }
  }

  if (loading) return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.skeletonWrap}>
        <div className={styles.skelPoster} />
        <div className={styles.skelContent}>
          {[80, 50, 100, 90, 70].map((w, i) => (
            <div key={i} className={styles.skelLine} style={{ width: `${w}%`, marginBottom: i === 1 ? 24 : 12 }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!movie) return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.notFound}>
        <span>🎬</span>
        <h2>Movie not found</h2>
        <button onClick={() => navigate('/home')}>← Back to search</button>
      </div>
    </div>
  );

  const ratingColor = getRatingColor(movie.imdbRating);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Blurred backdrop */}
      <div className={styles.backdrop}
        style={{ backgroundImage: `url(${getPosterUrl(movie.Poster)})` }} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

        <div className={styles.layout}>
          {/* Poster */}
          <div className={styles.posterCol}>
            <img src={getPosterUrl(movie.Poster)} alt={movie.Title} className={styles.poster} />
            <button
              className={`${styles.watchlistBtn} ${inList ? styles.inList : ''}`}
              onClick={handleWatchlist}
            >
              {inList ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
            </button>
            <button
              className={styles.trailerBtn}
              onClick={() => setShowTrailer(true)}
            >
              ▶ Watch Trailer
            </button>
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            <div className={styles.genres}>
              {movie.Genre?.split(',').map(g => (
                <span key={g} className={styles.genreTag}>{g.trim()}</span>
              ))}
            </div>

            <h1 className={styles.movieTitle}>{movie.Title}</h1>

            <div className={styles.metaRow}>
              <span className={styles.year}>📅 {movie.Year}</span>
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className={styles.rated}>{movie.Rated}</span>
              )}
              {formatRuntime(movie.Runtime) && (
                <span className={styles.runtime}>⏱ {formatRuntime(movie.Runtime)}</span>
              )}
            </div>

            {/* Ratings */}
            <div className={styles.ratingsRow}>
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className={styles.ratingBlock}>
                  <span className={styles.ratingNum} style={{ color: ratingColor }}>
                    {movie.imdbRating}
                  </span>
                  <span className={styles.ratingLabel}>IMDb</span>
                </div>
              )}
              {movie.Ratings?.find(r => r.Source === 'Rotten Tomatoes') && (
                <div className={styles.ratingBlock}>
                  <span className={styles.ratingNum} style={{ color: '#fa7c2b' }}>
                    {movie.Ratings.find(r => r.Source === 'Rotten Tomatoes').Value}
                  </span>
                  <span className={styles.ratingLabel}>RT</span>
                </div>
              )}
            </div>

            {/* Details grid */}
            <div className={styles.detailGrid}>
              {[
                ['Director', movie.Director],
                ['Writer',   movie.Writer],
                ['Actors',   movie.Actors],
                ['Country',  movie.Country],
                ['Language', movie.Language],
                ['Awards',   movie.Awards],
              ].filter(([, v]) => v && v !== 'N/A').map(([label, value]) => (
                <div key={label} className={styles.detailRow}>
                  <span className={styles.detailLabel}>{label}</span>
                  <span className={styles.detailValue}>{value}</span>
                </div>
              ))}
            </div>

            {/* Plot */}
            {(wiki?.extract || movie.Plot) && (
              <div className={styles.plotSection}>
                <h3>📖 Plot</h3>
                <p>{wiki?.extract || movie.Plot}</p>
                {wiki?.content_urls?.desktop?.page && (
                  <a href={wiki.content_urls.desktop.page} target="_blank" rel="noreferrer">
                    Read full article on Wikipedia →
                  </a>
                )}
              </div>
            )}

            {/* Streaming */}
            {streaming && (
              <div className={styles.streamingSection}>
                <h3>📺 Where to Watch</h3>
                <div className={styles.platforms}>
                  {streaming.platforms.map(p => (
                    <span key={p} className={styles.platform}>{p}</span>
                  ))}
                </div>
                {streaming.isFallback && (
                  <p className={styles.fallbackNote}>* Availability may vary by region</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal
          movieTitle={movie.Title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}