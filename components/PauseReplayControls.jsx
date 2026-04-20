import React from 'react';

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    alignItems: 'center'
  },
  btn: {
    background: 'transparent',
    border: '1px solid var(--border-medium)',
    color: 'var(--text-main)',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default function PauseReplayControls({ isPlaying, isPaused, onPause, onResume, onReplay }) {
  if (!isPlaying && !isPaused) {
    return (
      <div style={styles.container}>
        <button 
          style={styles.btn} 
          onClick={onReplay}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-main)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
        >Replay Audio</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
       {isPlaying ? (
         <button 
           style={styles.btn} 
           onClick={onPause}
           onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-main)'}
           onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
         >Pause</button>
       ) : (
         <button 
           style={styles.btn} 
           onClick={onResume}
           onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-main)'}
           onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
         >Resume</button>
       )}
       <button 
         style={styles.btn} 
         onClick={onReplay}
         onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-main)'}
         onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
       >Restart</button>
    </div>
  );
}
