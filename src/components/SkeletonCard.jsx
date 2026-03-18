import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.poster} />
      <div className={styles.info}>
        <div className={styles.line} style={{ width: '80%' }} />
        <div className={styles.line} style={{ width: '50%', marginTop: 8 }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </>
  );
}