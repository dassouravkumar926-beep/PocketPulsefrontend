import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { getHealthScoreColor } from '../utils/calculations';

const HealthScoreCard = ({ healthScore }) => {
  if (!healthScore) return null;

  const { score = 0, rating = 'Fair', factors = [] } = healthScore;
  const scoreColor = getHealthScoreColor(score);

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color={scoreColor} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Financial Health Score</h3>
        </div>
        <span
          className="badge"
          style={{
            background: `rgba(${score >= 70 ? '16, 185, 129' : '245, 158, 11'}, 0.15)`,
            color: scoreColor,
            border: `1px solid ${scoreColor}`,
          }}
        >
          {rating}
        </span>
      </div>

      {/* Main Score & Circle Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(17, 24, 39, 0.9) 60%, rgba(99, 102, 241, 0.1) 100%)`,
            border: `4px solid ${scoreColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px rgba(99, 102, 241, 0.25)`,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
        </div>

        <div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>
            This educational indicator reflects budget discipline, savings rate, and spending diversification.
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Not formal financial advice • Designed to build positive habits
          </span>
        </div>
      </div>

      {/* Factors List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {factors.map((f, idx) => (
          <div
            key={idx}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{f.factor}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {f.score} / {f.maxScore} pts
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{f.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthScoreCard;
