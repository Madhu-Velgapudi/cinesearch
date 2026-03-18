import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import MovieCard from '../components/MovieCard';
import SearchHistory from '../components/SearchHistory';
import TrendingSection from '../components/TrendingSection';
import { SkeletonGrid } from '../components/SkeletonCard';
import { useMovieSearch } from '../hooks/useMovieSearch';
import styles from './HomePage.module.css';

const MAX_HISTORY = 6;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem('searchHistory')) || []; }
  catch { return []; }
}
function saveHistory(h) {
  localStorage.setItem('searchHistory', JSON.stringify(h));
}

export default function HomePage() {
  const [filters, setFilters] = useState({ rating: '', genre: '', year: '' });
  const [history, setHistory] = useState(loadHistory);

  const {
    suggestions, fetchSuggestions, clearSuggestions,
    result, recommendations, loading, error,
    searchMovie,
  } = useMovieSearch();

  const hasContent = result || recommendations.length > 0 || loading;

  // Add a query to history
  const addToHistory = useCallback((query) => {
    setHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      const updated  = [query, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, []);

  function handleSearch(query) {
    addToHistory(query);
    searchMovie(query, filters);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  }

  return (
    <div className={styles.page}>
      <Navbar onSearch={handleSearch} />

      {/* ── Hero / Search Section ───────────────────── */}
      <section className={`${styles.hero} ${hasContent ? styles.heroCompact : ''}`}>
        <h2 className={styles.heroTitle}>
          <span className={styles.heroLine1}>Find Your Next</span>
          <span className={styles.heroLine2}>Favourite Film</span>
        </h2>
        <div className={styles.heroAccent} />
        <p className={styles.heroSub}>Search millions of movies. Build your watchlist.</p>

        <SearchBar
          onSearch={handleSearch}
          suggestions={suggestions}
          onQueryChange={fetchSuggestions}
          onClearSuggestions={clearSuggestions}
        />

        <Filters filters={filters} onChange={setFilters} />

        {/* ── Search History Chips ── */}
        {!hasContent && (
          <SearchHistory
            history={history}
            onSelect={handleSearch}
            onClear={clearHistory}
          />
        )}
      </section>

      {/* ── Results ─────────────────────────────────── */}
      <main className={styles.main}>
        {loading && (
          <>
            <SectionLabel>Searching…</SectionLabel>
            <div className={styles.grid}><SkeletonGrid count={4} /></div>
          </>
        )}

        {error && !loading && (
          <div className={styles.empty}>
            <span>😕</span>
            <p>{error}</p>
          </div>
        )}

        {result && !loading && (
          <>
            <SectionLabel>🎥 Best Match</SectionLabel>
            <div className={styles.grid}>
              <MovieCard movie={result} index={0} />
            </div>
          </>
        )}

        {recommendations.length > 0 && !loading && (
          <>
            <SectionLabel>🎯 Similar Movies</SectionLabel>
            <div className={styles.grid}>
              {recommendations.map((m, i) => (
                <MovieCard key={m.imdbID} movie={m} index={i} />
              ))}
            </div>
          </>
        )}

        {/* ── Trending Section — only shown when no search results ── */}
        {!hasContent && !error && (
          <TrendingSection />
        )}
      </main>
    </div>
  );
}

function SectionLabel({ children }) {
  return <h2 className={styles.sectionLabel}>{children}</h2>;
}