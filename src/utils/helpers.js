export function getPosterUrl(poster) {
  return poster && poster !== 'N/A'
    ? poster
    : 'https://placehold.co/300x450/0d1420/4f8ef7?text=No+Poster';
}

export function formatRuntime(runtime) {
  if (!runtime || runtime === 'N/A') return null;
  const mins = parseInt(runtime);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function getRatingColor(rating) {
  const r = parseFloat(rating);
  if (r >= 8)   return '#36d39a';
  if (r >= 6.5) return '#e8b84b';
  return '#f05454';
}

export function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str;
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30)  return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString();
}