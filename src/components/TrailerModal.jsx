import { useEffect, useState } from 'react';
import styles from './TrailerModal.module.css';

export default function TrailerModal({ movieTitle, movieYear, onClose }) {
  const [step, setStep] = useState('search'); // 'search' | 'playing'

  const searchQuery = `${movieTitle}${movieYear ? ' ' + movieYear : ''} official trailer`;
  const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <span>🎬</span>
            <h2 className={styles.title}>{movieTitle}</h2>
            <span className={styles.badge}>TRAILER</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className={styles.videoWrap}>
          <div className={styles.searchWrap}>
            <div className={styles.movieIcon}>🎥</div>
            <h3 className={styles.searchTitle}>Watch "{movieTitle}" Trailer</h3>
            <p className={styles.searchSub}>
              Click below to find the official trailer on YouTube
            </p>
            <a
              href={ytSearch}
              target="_blank"
              rel="noreferrer"
              className={styles.ytSearchBtn}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Search Trailer on YouTube
            </a>
            <p className={styles.hint}>
              💡 Tip: Click the first result — it's usually the official trailer
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerText}>
            Press <kbd>Esc</kbd> to close
          </span>
          <a href={ytSearch} target="_blank" rel="noreferrer" className={styles.youtubeLink}>
            Open YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}