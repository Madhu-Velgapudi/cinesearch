// src/components/SearchHistory.jsx
import styles from './SearchHistory.module.css';

export default function SearchHistory({ history, onSelect, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>🕐 Recent:</span>
      <div className={styles.chips}>
        {history.map((q, i) => (
          <button key={i} className={styles.chip} onClick={() => onSelect(q)}>
            {q}
          </button>
        ))}
      </div>
      <button className={styles.clearBtn} onClick={onClear} title="Clear history">
        Clear
      </button>
    </div>
  );
}