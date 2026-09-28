import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeMap = {
    sm: { width: '24px', height: '24px', border: '3px' },
    md: { width: '40px', height: '40px', border: '4px' },
    lg: { width: '56px', height: '56px', border: '5px' },
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '16px' }}>
      <div
        style={{
          width: dim.width,
          height: dim.height,
          border: `${dim.border} solid rgba(99, 102, 241, 0.2)`,
          borderTop: `${dim.border} solid var(--primary)`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
