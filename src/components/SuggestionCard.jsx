import React from 'react';
import { AlertCircle, AlertTriangle, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';

const severityMap = {
  high: {
    icon: AlertCircle,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    badgeClass: 'badge-danger',
    label: 'High Priority',
  },
  medium: {
    icon: AlertTriangle,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    badgeClass: 'badge-warning',
    label: 'Warning',
  },
  info: {
    icon: Lightbulb,
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
    badgeClass: 'badge-info',
    label: 'Smart Insight',
  },
  low: {
    icon: CheckCircle2,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    badgeClass: 'badge-success',
    label: 'Good Habit',
  },
};

const SuggestionCard = ({ suggestion }) => {
  const meta = severityMap[suggestion.severity] || severityMap.info;
  const IconComponent = meta.icon;

  return (
    <div
      className="glass-card"
      style={{
        borderLeft: `4px solid ${meta.color}`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px 24px',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              background: meta.bg,
              color: meta.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconComponent size={18} />
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{suggestion.title}</h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {suggestion.category && (
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
              {suggestion.category}
            </span>
          )}
          <span className={`badge ${meta.badgeClass}`}>{meta.label}</span>
        </div>
      </div>

      {/* Main Message */}
      <p style={{ color: 'var(--text-primary)', fontSize: '0.925rem', lineHeight: 1.5 }}>
        {suggestion.message}
      </p>

      {/* Actionable Tip Box */}
      {suggestion.actionableTip && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Tip: </strong>
            {suggestion.actionableTip}
          </p>
        </div>
      )}

      {/* Why was this generated? Explanation */}
      {suggestion.reason && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Why you see this: {suggestion.reason}
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;
