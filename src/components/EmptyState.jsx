import React from 'react';
import { PlusCircle, Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'Start tracking to see your data visualized here.',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-color)',
        margin: '16px 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: '16px',
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem', marginBottom: actionLabel ? '20px' : '0' }}>
        {description}
      </p>
      {actionLabel && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
