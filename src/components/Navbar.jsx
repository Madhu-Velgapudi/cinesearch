import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getAvatarDisplay } from '../pages/AvatarPage';
import styles from './Navbar.module.css';

export default function Navbar({ onSearch }) {
  const { user, logout }       = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { watchlist }          = useWatchlist();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [navSearch,     setNavSearch]     = useState('');
  const [showNavSearch, setShowNavSearch] = useState(false);

  const dropRef   = useRef(null);
  const searchRef = useRef(null);

  const isHome      = location.pathname === '/home';
  const isWatchlist = location.pathname === '/watchlist';
  const avatar      = getAvatarDisplay(user?.avatar);

  useEffect(() => {
    const h = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (showNavSearch) searchRef.current?.focus();
  }, [showNavSearch]);

  function handleLogout() { logout(); navigate('/auth'); }

  function handleNavSearch(e) {
    if (e.key === 'Enter' && navSearch.trim()) {
      if (!isHome) navigate('/home');
      onSearch?.(navSearch.trim());
      setNavSearch('');
      setShowNavSearch(false);
    }
    if (e.key === 'Escape') { setShowNavSearch(false); setNavSearch(''); }
  }

  return (
    <nav className={styles.nav}>

      {/* LEFT */}
      <button
        className={`${styles.watchlistBtn} ${isWatchlist ? styles.activePage : ''}`}
        onClick={() => navigate('/watchlist')}
      >
        <span>❤️</span>
        <span>Watchlist</span>
        {watchlist.length > 0 && <span className={styles.badge}>{watchlist.length}</span>}
      </button>

      {/* CENTER */}
      <button className={styles.logo} onClick={() => navigate('/home')}>
        🎬 <span>CineSearch</span>
      </button>

      {/* RIGHT */}
      <div className={styles.right}>

        {/* Navbar Search */}
        <div className={styles.navSearchWrap}>
          {showNavSearch ? (
            <div className={styles.navSearchBox}>
              <span>🔍</span>
              <input
                ref={searchRef}
                className={styles.navSearchInput}
                value={navSearch}
                onChange={e => setNavSearch(e.target.value)}
                onKeyDown={handleNavSearch}
                placeholder="Search movies…"
              />
              <button className={styles.navSearchClose}
                onClick={() => { setShowNavSearch(false); setNavSearch(''); }}>✕</button>
            </div>
          ) : (
            <button
              className={`${styles.iconBtn} ${isHome ? styles.activeIcon : ''}`}
              onClick={() => setShowNavSearch(true)}
              title="Search"
            >🔍</button>
          )}
        </div>

        {/* Theme */}
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Avatar + Dropdown */}
        <div className={styles.avatarWrap} ref={dropRef}>
          <button
            className={styles.avatarBtn}
            style={{ background: avatar.bg }}
            onClick={() => setDropdownOpen(o => !o)}
          >
            {avatar.url
              ? <img src={avatar.url} alt="avatar" className={styles.avatarImg} />
              : <span className={styles.avatarEmoji}>👤</span>
            }
            <span className={styles.avatarChevron}>{dropdownOpen ? '▲' : '▼'}</span>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              {/* Header */}
              <div className={styles.dropHeader}>
                <div className={styles.dropAvatarCircle} style={{ background: avatar.bg }}>
                  {avatar.url
                    ? <img src={avatar.url} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',borderRadius:'10px'}} />
                    : <span style={{fontSize:'22px'}}>👤</span>
                  }
                </div>
                <div>
                  <p className={styles.dropName}>{user?.name}</p>
                  <p className={styles.dropEmail}>{user?.email}</p>
                </div>
              </div>

              <div className={styles.dropDivider} />

              <button className={styles.dropItem}
                onClick={() => { setDropdownOpen(false); navigate('/avatar'); }}>
                <span>🎭</span> Change Avatar
              </button>
              <button className={styles.dropItem}
                onClick={() => { navigate('/watchlist'); setDropdownOpen(false); }}>
                <span>❤️</span> My Watchlist
                {watchlist.length > 0 && <span className={styles.dropBadge}>{watchlist.length}</span>}
              </button>
              <button className={styles.dropItem} onClick={toggleTheme}>
                <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              <div className={styles.dropDivider} />

              <button className={styles.dropItemRed} onClick={handleLogout}>
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}