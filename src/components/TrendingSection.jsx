import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { getPosterUrl } from '../utils/helpers';
import { searchMovies } from '../services/omdb';
import styles from './TrendingSection.module.css';

// Curated lists — each tab has specific popular titles
const TABS = [
  {
    label: '🔥 Trending',
    titles: ['Oppenheimer','Barbie','Dune','Avatar','Top Gun Maverick','The Batman','Black Panther','Spider-Man No Way Home','Joker','Tenet']
  },
  {
    label: '⭐ Top Rated',
    titles: ['The Shawshank Redemption','The Godfather','The Dark Knight','Schindler\'s List','12 Angry Men','Pulp Fiction','Forrest Gump','Inception','The Silence of the Lambs','Interstellar']
  },
  {
    label: '🎭 Drama',
    titles: ['The Godfather','Schindler\'s List','Forrest Gump','The Green Mile','A Beautiful Mind','Good Will Hunting','The Pursuit of Happyness','Manchester by the Sea','Parasite','Marriage Story']
  },
  {
    label: '😂 Comedy',
    titles: ['The Grand Budapest Hotel','Superbad','Game Night','The Nice Guys','Knives Out','Get Out','Bridesmaids','The Wolf of Wall Street','Tropic Thunder','Step Brothers']
  },
  {
    label: '👻 Horror',
    titles: ['Get Out','Hereditary','A Quiet Place','It','The Conjuring','Midsommar','Us','The Witch','Annabelle','Sinister']
  },
  {
    label: '🚀 Sci-Fi',
    titles: ['Interstellar','Inception','Dune','The Matrix','Arrival','Blade Runner 2049','Gravity','Ex Machina','Edge of Tomorrow','Avatar']
  },
];

export default function TrendingSection() {
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState(0);

  const navigate = useNavigate();
  const { addMovie, removeMovie, isInWatchlist } = useWatchlist();
  const { toast } = useToast();

  useEffect(() => { loadTab(active); }, [active]);

  async function loadTab(tabIdx) {
    setLoading(true);
    setMovies([]);
    const titles = TABS[tabIdx].titles;

    // Fetch all titles in parallel, take first result for each
    const results = await Promise.all(
      titles.map(t => searchMovies(t).then(r => r[0]).catch(() => null))
    );
    setMovies(results.filter(Boolean).slice(0, 10));
    setLoading(false);
  }

  function handleWatchlist(e, movie) {
    e.stopPropagation();
    try {
      if (isInWatchlist(movie.Title)) {
        removeMovie(movie.Title);
        toast.info('Removed from watchlist');
      } else {
        addMovie(movie);
        toast.success('Added to watchlist ❤️');
      }
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Discover Movies
            <span className={styles.liveDot} />
          </h2>
          <p className={styles.sub}>Browse by category · {TABS[active].label}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            className={`${styles.tab} ${active === i ? styles.activeTab : ''}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Strip */}
      <div className={styles.strip}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skelCard}>
                <div className={styles.skelPoster} />
                <div className={styles.skelLine} style={{ width: '70%' }} />
                <div className={styles.skelLine} style={{ width: '45%' }} />
              </div>
            ))
          : movies.map((movie, i) => (
              <TrendCard
                key={movie.imdbID || i}
                movie={movie}
                index={i}
                inList={isInWatchlist(movie.Title)}
                onOpen={() => navigate(`/movie/${encodeURIComponent(movie.Title)}`)}
                onWatchlist={(e) => handleWatchlist(e, movie)}
              />
            ))
        }
      </div>
    </div>
  );
}

function TrendCard({ movie, index, inList, onOpen, onWatchlist }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Big rank number behind poster */}
      <div className={styles.rank}>{index + 1}</div>

      <div className={styles.posterWrap}>
        <img
          src={getPosterUrl(movie.Poster)}
          alt={movie.Title}
          className={styles.poster}
          loading="lazy"
        />
        <div className={`${styles.overlay} ${hovered ? styles.overlayVisible : ''}`}>
          <button className={styles.playBtn}>▶ View</button>
        </div>
        <button
          className={`${styles.heartBtn} ${inList ? styles.heartActive : ''}`}
          onClick={onWatchlist}
        >
          {inList ? '❤️' : '🤍'}
        </button>
      </div>

      <div className={styles.info}>
        <p className={styles.movieTitle}>{movie.Title}</p>
        <p className={styles.year}>{movie.Year}</p>
      </div>
    </div>
  );
}