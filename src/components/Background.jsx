// src/components/Background.jsx
// Drop this once inside App.jsx — it renders the animated background for every page

const PARTICLES = [
  { emoji: '🎬', left: '5%',  duration: 18, delay: 0 },
  { emoji: '⭐', left: '15%', duration: 24, delay: 3 },
  { emoji: '🎥', left: '28%', duration: 20, delay: 7 },
  { emoji: '🍿', left: '42%', duration: 28, delay: 1 },
  { emoji: '🎭', left: '58%', duration: 16, delay: 5 },
  { emoji: '📽️', left: '70%', duration: 22, delay: 9 },
  { emoji: '⭐', left: '82%', duration: 26, delay: 2 },
  { emoji: '🎬', left: '92%', duration: 19, delay: 12 },
];

export default function Background() {
  return (
    <div className="cinema-bg">
      {/* Twinkling stars */}
      <div className="stars" />

      {/* Glowing colour orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />

      {/* Floating emoji particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            fontSize: `${14 + (i % 3) * 4}px`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}