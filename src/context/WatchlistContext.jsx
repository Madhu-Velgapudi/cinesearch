import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const { user } = useAuth();

  // Key is per-user: "watchlist_<userId>"
  const storageKey = user ? `watchlist_${user.id}` : null;

  const [watchlist, setWatchlist] = useState([]);

  // Load the correct watchlist whenever user changes (login/logout/switch)
  useEffect(() => {
    if (!storageKey) {
      setWatchlist([]);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
      setWatchlist(saved);
    } catch {
      setWatchlist([]);
    }
  }, [storageKey]);

  function persist(updated) {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setWatchlist(updated);
  }

  function addMovie(movie) {
    if (watchlist.some(m => m.title === (movie.Title || movie.title))) {
      throw new Error('Already in watchlist');
    }
    persist([...watchlist, {
      title:   movie.Title   || movie.title,
      poster:  movie.Poster  || movie.poster,
      imdbID:  movie.imdbID  || null,
      year:    movie.Year    || movie.year || '',
      rating:  movie.imdbRating || movie.rating || 'N/A',
      addedAt: new Date().toISOString(),
      watched: false,
    }]);
  }

  function removeMovie(title) {
    persist(watchlist.filter(m => m.title !== title));
  }

  function toggleWatched(title) {
    persist(watchlist.map(m => m.title === title ? { ...m, watched: !m.watched } : m));
  }

  function isInWatchlist(title) {
    return watchlist.some(m => m.title === title);
  }

  return (
    <WatchlistContext.Provider value={{ watchlist, addMovie, removeMovie, toggleWatched, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);