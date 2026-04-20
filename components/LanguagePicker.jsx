import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    background: 'linear-gradient(135deg, #020917 0%, #071428 50%, #020917 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  glow1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 70%)',
    top: '-100px',
    left: '-100px',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,255,200,0.05) 0%, transparent 70%)',
    bottom: '-80px',
    right: '-80px',
    pointerEvents: 'none',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(0,180,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.03) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0,180,255,0.1)',
    border: '1px solid rgba(0,180,255,0.25)',
    borderRadius: '20px',
    padding: '5px 14px',
    fontSize: '11px',
    color: '#00b4ff',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '24px',
    fontWeight: '600',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00b4ff',
    animation: 'blink 1.5s infinite',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  logoIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #0066ff, #00c8ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    boxShadow: '0 0 24px rgba(0,180,255,0.3)',
  },
  logoText: {
    fontSize: '42px',
    fontWeight: '800',
    letterSpacing: '-1px',
    color: '#ffffff',
    fontFamily: "'DM Sans', sans-serif",
  },
  logoAccent: {
    background: 'linear-gradient(90deg, #0099ff, #00e5cc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  tagline: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '8px',
    textAlign: 'center',
    letterSpacing: '0.3px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(0,180,255,0.6)',
    marginBottom: '40px',
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '32px',
    width: '100%',
    maxWidth: '520px',
    backdropFilter: 'blur(12px)',
    marginBottom: '28px',
  },
  cardTitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '16px',
    fontWeight: '600',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  button: {
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    textAlign: 'center',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '500',
  },
  buttonLast: {
    gridColumn: '1 / -1',
  },
  featuresRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '520px',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '8px',
    padding: '6px 12px',
  },
  featureIcon: {
    fontSize: '13px',
  },
  footer: {
    marginTop: '28px',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    letterSpacing: '0.5px',
  }
};

const features = [
  { icon: '🗣️', text: 'Voice Input' },
  { icon: '🔊', text: 'Speaks Back' },
  { icon: '🏦', text: 'FD Jargon Explainer' },
  { icon: '🛡️', text: 'DICGC Safety Check' },
  { icon: '📊', text: 'Earnings Calculator' },
  { icon: '📋', text: 'Booking Guide' },
];

export default function LanguagePicker({ languages, onSelectLanguage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      .lang-btn:hover { background: rgba(0,180,255,0.12) !important; border-color: rgba(0,180,255,0.4) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,180,255,0.15) !important; }
    `;
    document.head.appendChild(style);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const entries = Object.entries(languages);

  return (
    <div style={styles.container}>
      <div style={styles.glow1} />
      <div style={styles.glow2} />
      <div style={styles.grid} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}>

        <div style={styles.badge}>
          <div style={styles.dot} />
          AI-Powered · Free · No Sign-up
        </div>

        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>💰</div>
          <div style={styles.logoText}>
            FD <span style={styles.logoAccent}>Mitra</span>
          </div>
        </div>

        <div style={styles.tagline}>आपका भरोसेमंद Fixed Deposit सलाहकार</div>
        <div style={styles.subtitle}>Your trusted family elder for FD advice — in your language</div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>🌐 अपनी भाषा चुनें — Choose Your Language</div>
          <div style={styles.buttonGrid}>
            {entries.map(([key, config], i) => (
              <button
                key={key}
                className="lang-btn"
                style={{
                  ...styles.button,
                  ...(i === entries.length - 1 && entries.length % 2 !== 0 ? styles.buttonLast : {})
                }}
                onClick={() => onSelectLanguage(key)}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', letterSpacing: '0.5px' }}>
          ✦ What FD Mitra can do for you
        </div>

        <div style={styles.featuresRow}>
          {features.map((f, i) => (
            <div key={i} style={styles.feature}>
              <span style={styles.featureIcon}>{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          
        </div>
      </div>
    </div>
  );
}

