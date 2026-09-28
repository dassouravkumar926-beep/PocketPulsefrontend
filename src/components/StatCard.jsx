import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#6366f1',
  trend, // { direction: 'up' | 'down', label: string }
  badge,
}) => {
  return (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative subtle background gradient blob */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: color,
          opacity: 0.12,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
        {Icon && (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{value}</h2>
        {badge && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{badge}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem' }}>
        {trend && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 700,
              color: trend.direction === 'up' ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {trend.direction === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {trend.label}
          </span>
        )}
        {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatCard;
