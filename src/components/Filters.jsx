import styles from './Filters.module.css';

const RATINGS = [['', 'All Ratings'], ['7', '7+ ⭐'], ['8', '8+ ⭐'], ['9', '9+ ⭐']];
const GENRES  = ['', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation'];

export default function Filters({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className={styles.wrap}>
      <select className={styles.field} value={filters.rating} onChange={set('rating')}>
        {RATINGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>

      <select className={styles.field} value={filters.genre} onChange={set('genre')}>
        {GENRES.map(g => <option key={g} value={g}>{g || 'All Genres'}</option>)}
      </select>

      <input
        className={styles.field}
        type="number" min="1900" max="2025"
        placeholder="Year"
        value={filters.year}
        onChange={set('year')}
      />

      {(filters.rating || filters.genre || filters.year) && (
        <button className={styles.clearBtn} onClick={() => onChange({ rating: '', genre: '', year: '' })}>
          Clear ✕
        </button>
      )}
    </div>
  );
}