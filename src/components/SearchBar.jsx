import { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, suggestions, onQueryChange, onClearSuggestions }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClearSuggestions?.();
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClearSuggestions]);

  function handleChange(e) {
    setQuery(e.target.value);
    onQueryChange?.(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query.trim());
      onClearSuggestions?.();
    }
  }

  function selectSuggestion(title) {
    setQuery(title);
    onSearch(title);
    onClearSuggestions?.();
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={`${styles.inputWrap} ${focused ? styles.focused : ''}`}>
        <span className={styles.icon}>🔍</span>
        <input
          className={styles.input}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          placeholder="Search for a movie…"
          autoComplete="off"
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => { setQuery(''); onClearSuggestions?.(); }}>✕</button>
        )}
        <button className={styles.searchBtn} onClick={() => query.trim() && onSearch(query.trim())}>
          Search
        </button>
      </div>

      {focused && suggestions?.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((s) => (
            <li key={s.imdbID} className={styles.suggItem} onMouseDown={() => selectSuggestion(s.Title)}>
              <img
                src={s.Poster !== 'N/A' ? s.Poster : 'https://placehold.co/40x56/0d1420/4f8ef7?text=?'}
                alt={s.Title} className={styles.suggPoster}
              />
              <div className={styles.suggInfo}>
                <span className={styles.suggTitle}>{s.Title}</span>
                <span className={styles.suggYear}>{s.Year}</span>
              </div>
              <span className={styles.suggArrow}>→</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}