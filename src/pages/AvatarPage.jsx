import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AvatarPage.module.css';

// Using DiceBear API for consistent, always-working avatar images
// Each "seed" generates a unique character face
const AVATAR_CATEGORIES = [
  {
    id: 'onepiece',
    category: 'ONE PIECE',
    color: '#e8b84b',
    avatars: [
      { id: 'op_luffy',   seed: 'luffy-onepiece',   label: 'Luffy',   bg: '#c0392b' },
      { id: 'op_zoro',    seed: 'zoro-onepiece',    label: 'Zoro',    bg: '#27ae60' },
      { id: 'op_nami',    seed: 'nami-onepiece',    label: 'Nami',    bg: '#e67e22' },
      { id: 'op_sanji',   seed: 'sanji-onepiece',   label: 'Sanji',   bg: '#2c3e50' },
      { id: 'op_robin',   seed: 'robin-onepiece',   label: 'Robin',   bg: '#8e44ad' },
      { id: 'op_chopper', seed: 'chopper-onepiece', label: 'Chopper', bg: '#e74c3c' },
    ]
  },
  {
    id: 'naruto',
    category: 'NARUTO',
    color: '#e8a020',
    avatars: [
      { id: 'na_naruto',  seed: 'naruto-uzumaki',   label: 'Naruto',  bg: '#e67e22' },
      { id: 'na_sasuke',  seed: 'sasuke-uchiha',    label: 'Sasuke',  bg: '#2c3e50' },
      { id: 'na_sakura',  seed: 'sakura-haruno',    label: 'Sakura',  bg: '#e91e8c' },
      { id: 'na_kakashi', seed: 'kakashi-hatake',   label: 'Kakashi', bg: '#7f8c8d' },
      { id: 'na_itachi',  seed: 'itachi-uchiha',    label: 'Itachi',  bg: '#1a0a2e' },
      { id: 'na_gaara',   seed: 'gaara-sand',       label: 'Gaara',   bg: '#16a085' },
    ]
  },
  {
    id: 'breakingbad',
    category: 'BREAKING BAD',
    color: '#2ecc71',
    avatars: [
      { id: 'bb_walter',  seed: 'walter-white-bb',  label: 'Walter',  bg: '#2c3e50' },
      { id: 'bb_jesse',   seed: 'jesse-pinkman-bb', label: 'Jesse',   bg: '#1a3a1a' },
      { id: 'bb_saul',    seed: 'saul-goodman-bb',  label: 'Saul',    bg: '#1a2a3a' },
      { id: 'bb_hank',    seed: 'hank-schrader-bb', label: 'Hank',    bg: '#3a2a1a' },
      { id: 'bb_gus',     seed: 'gus-fring-bb',     label: 'Gus',     bg: '#0a1a0a' },
      { id: 'bb_mike',    seed: 'mike-ehrmantraut',  label: 'Mike',    bg: '#1a1a2a' },
    ]
  },
  {
    id: 'strangerthings',
    category: 'STRANGER THINGS',
    color: '#e74c3c',
    avatars: [
      { id: 'st_eleven',  seed: 'eleven-stranger',  label: 'Eleven',  bg: '#1a0a2e' },
      { id: 'st_mike',    seed: 'mike-wheeler-st',  label: 'Mike',    bg: '#0a1a3a' },
      { id: 'st_dustin',  seed: 'dustin-st',        label: 'Dustin',  bg: '#1a2a0a' },
      { id: 'st_hopper',  seed: 'hopper-st',        label: 'Hopper',  bg: '#2a1a0a' },
      { id: 'st_will',    seed: 'will-byers-st',    label: 'Will',    bg: '#0a2a1a' },
      { id: 'st_max',     seed: 'max-mayfield-st',  label: 'Max',     bg: '#2a0a1a' },
    ]
  },
  {
    id: 'attackontitan',
    category: 'ATTACK ON TITAN',
    color: '#95a5a6',
    avatars: [
      { id: 'aot_eren',   seed: 'eren-yeager-aot',  label: 'Eren',    bg: '#1a2a0a' },
      { id: 'aot_mikasa', seed: 'mikasa-aot',       label: 'Mikasa',  bg: '#0a0a1a' },
      { id: 'aot_armin',  seed: 'armin-aot',        label: 'Armin',   bg: '#1a1a0a' },
      { id: 'aot_levi',   seed: 'levi-ackerman',    label: 'Levi',    bg: '#0a1a1a' },
      { id: 'aot_hange',  seed: 'hange-zoe-aot',    label: 'Hange',   bg: '#1a0a0a' },
      { id: 'aot_erwin',  seed: 'erwin-smith-aot',  label: 'Erwin',   bg: '#2a1a0a' },
    ]
  },
  {
    id: 'dragonball',
    category: 'DRAGON BALL Z',
    color: '#f39c12',
    avatars: [
      { id: 'dbz_goku',   seed: 'goku-dbz',         label: 'Goku',    bg: '#1a3a8a' },
      { id: 'dbz_vegeta', seed: 'vegeta-dbz',       label: 'Vegeta',  bg: '#1a0a2e' },
      { id: 'dbz_gohan',  seed: 'gohan-dbz',        label: 'Gohan',   bg: '#0a1a3a' },
      { id: 'dbz_piccolo',seed: 'piccolo-dbz',      label: 'Piccolo', bg: '#0a2a0a' },
      { id: 'dbz_trunks', seed: 'trunks-dbz',       label: 'Trunks',  bg: '#2a0a2a' },
      { id: 'dbz_frieza', seed: 'frieza-dbz',       label: 'Frieza',  bg: '#1a0a1a' },
    ]
  },
  {
    id: 'got',
    category: 'GAME OF THRONES',
    color: '#bdc3c7',
    avatars: [
      { id: 'got_jon',    seed: 'jon-snow-got',     label: 'Jon Snow',bg: '#0a0a1a' },
      { id: 'got_dany',   seed: 'daenerys-got',     label: 'Daenerys',bg: '#1a0a0a' },
      { id: 'got_tyrion', seed: 'tyrion-lannister', label: 'Tyrion',  bg: '#1a1a0a' },
      { id: 'got_cersei', seed: 'cersei-lannister', label: 'Cersei',  bg: '#2a1a0a' },
      { id: 'got_arya',   seed: 'arya-stark-got',   label: 'Arya',    bg: '#0a1a0a' },
      { id: 'got_ned',    seed: 'ned-stark-got',    label: 'Ned',     bg: '#0a1a1a' },
    ]
  },
  {
    id: 'marvel',
    category: 'MARVEL',
    color: '#e74c3c',
    avatars: [
      { id: 'mv_tony',    seed: 'tony-stark-marvel',label: 'Iron Man', bg: '#8b0000' },
      { id: 'mv_steve',   seed: 'steve-rogers-cap', label: 'Cap',     bg: '#003366' },
      { id: 'mv_thor',    seed: 'thor-odinson',     label: 'Thor',    bg: '#001a4d' },
      { id: 'mv_natasha', seed: 'black-widow-nat',  label: 'Widow',   bg: '#1a0a0a' },
      { id: 'mv_peter',   seed: 'peter-parker-spd', label: 'Spidey',  bg: '#8b0000' },
      { id: 'mv_wanda',   seed: 'wanda-maximoff',   label: 'Wanda',   bg: '#4a0000' },
    ]
  },
];

const STYLE = 'adventurer'; // DiceBear style

function avatarUrl(seed) {
  return `https://api.dicebear.com/7.x/${STYLE}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`;
}

export function getAvatarDisplay(avatarId) {
  if (!avatarId) return { type: 'dicebear', url: avatarUrl('default-user'), bg: '#1a1a2e', label: 'Guest' };
  for (const cat of AVATAR_CATEGORIES) {
    const found = cat.avatars.find(a => a.id === avatarId);
    if (found) return { type: 'dicebear', url: avatarUrl(found.seed), bg: found.bg, label: found.label };
  }
  return { type: 'dicebear', url: avatarUrl('default-user'), bg: '#1a1a2e', label: 'User' };
}

export default function AvatarPage() {
  const { user, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(user?.avatar || null);

  function handleSave() {
    if (selected) updateAvatar(selected);
    navigate(-1);
  }

  const currentAvatar = getAvatarDisplay(selected);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div className={styles.headerCenter}>
          <h1 className={styles.title}>Choose a Profile Icon</h1>
          <div className={styles.forUser}>
            <div className={styles.previewCircle} style={{ background: currentAvatar.bg }}>
              <img src={currentAvatar.url} alt="avatar" />
            </div>
            <span>For {user?.name?.split(' ')[0]}</span>
          </div>
        </div>
        <button
          className={`${styles.saveBtn} ${selected ? styles.saveBtnActive : ''}`}
          onClick={handleSave}
          disabled={!selected}
        >
          Save
        </button>
      </div>

      {/* Categories */}
      <div className={styles.content}>
        {AVATAR_CATEGORIES.map((cat, ci) => (
          <div key={cat.id} className={styles.categoryBlock}
            style={{ animationDelay: `${ci * 0.08}s` }}>
            <h2 className={styles.categoryTitle} style={{ '--cat-color': cat.color }}>
              {cat.category}
            </h2>
            <div className={styles.grid}>
              {cat.avatars.map(a => (
                <button
                  key={a.id}
                  className={`${styles.avatarCard} ${selected === a.id ? styles.selectedCard : ''}`}
                  style={{ '--card-bg': a.bg }}
                  onClick={() => setSelected(a.id)}
                >
                  <div className={styles.imgWrap}>
                    <img
                      src={avatarUrl(a.seed)}
                      alt={a.label}
                      className={styles.avatarImg}
                      loading="lazy"
                    />
                  </div>
                  <span className={styles.avatarLabel}>{a.label}</span>
                  {selected === a.id && <div className={styles.checkmark}>✓</div>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}