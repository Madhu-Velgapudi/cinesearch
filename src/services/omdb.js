const API_KEY = '74110179';
const BASE    = 'https://www.omdbapi.com';

export async function searchMovies(query) {
  const res  = await fetch(`${BASE}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
  const data = await res.json();
  if (data.Response === 'False') return [];
  return data.Search || [];
}

export async function getMovieByTitle(title) {
  const res  = await fetch(`${BASE}/?apikey=${API_KEY}&t=${encodeURIComponent(title)}&plot=full`);
  const data = await res.json();
  if (data.Response === 'False') return null;
  return data;
}

export async function getMovieById(id) {
  const res  = await fetch(`${BASE}/?apikey=${API_KEY}&i=${id}&plot=full`);
  const data = await res.json();
  if (data.Response === 'False') return null;
  return data;
}

export async function getRecommendations(genre) {
  const primary = genre.split(',')[0].trim();
  const res  = await fetch(`${BASE}/?apikey=${API_KEY}&s=${encodeURIComponent(primary)}&type=movie`);
  const data = await res.json();
  return data.Search?.slice(0, 12) || [];
}