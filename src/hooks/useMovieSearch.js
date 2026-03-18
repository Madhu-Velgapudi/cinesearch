import { useState, useCallback } from 'react';
import { searchMovies, getMovieByTitle, getRecommendations } from '../services/omdb';

export function useMovieSearch() {
  const [suggestions, setSuggestions] = useState([]);
  const [result,      setResult]      = useState(null);
  const [recommendations, setRecs]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 3) { setSuggestions([]); return; }
    const data = await searchMovies(query);
    setSuggestions(data.slice(0, 6));
  }, []);

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  const searchMovie = useCallback(async (title, filters = {}) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRecs([]);
    setSuggestions([]);

    try {
      const movie = await getMovieByTitle(title);
      if (!movie) { setError('Movie not found'); setLoading(false); return; }

      if (filters.rating && parseFloat(movie.imdbRating) < parseFloat(filters.rating)) {
        setError(`No result: rating below ${filters.rating}`); setLoading(false); return;
      }
      if (filters.year && movie.Year !== filters.year) {
        setError(`No result: year doesn't match`); setLoading(false); return;
      }
      if (filters.genre && !movie.Genre.toLowerCase().includes(filters.genre.toLowerCase())) {
        setError(`No result: genre doesn't match`); setLoading(false); return;
      }

      setResult(movie);
      setLoading(false);

      const recs = await getRecommendations(movie.Genre);
      setRecs(recs.filter(r => r.Title !== movie.Title));
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResult(null); setRecs([]); setError(null);
  }, []);

  return {
    suggestions, fetchSuggestions, clearSuggestions,
    result, recommendations, loading, error,
    searchMovie, clearResults,
  };
}