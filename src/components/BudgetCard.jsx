import React from 'react';
import {
  Utensils,
  Bus,
  ShoppingBag,
  Film,
  GraduationCap,
  Smartphone,
  Gamepad2,
  Tv,
  HeartPulse,
  Plane,
  Sparkles,
  Gift,
  Tag,
  Trash2,
  Edit2,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { getStatusBadge } from '../utils/calculations';

const iconMap = {
  Utensils,
  Bus,
  ShoppingBag,
  Film,
  GraduationCap,
  Smartphone,
  Gamepad2,
  Tv,
  HeartPulse,
  Plane,
  Sparkles,
  Gift,
  Tag,
};

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const IconComponent = iconMap[budget.category?.icon] || Tag;
  const catColor = budget.category?.color || '#6366f1';
  const badgeInfo = getStatusBadge(budget.status);

  // Cap visual bar at 100%
  const visualPercentage = Math.min(100, Math.max(0, budget.percentageUsed));

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header: Icon, Category Name, and Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: `rgba(${parseInt(catColor.slice(1, 3) || '63', 16)}, ${parseInt(catColor.slice(3, 5) || '66', 16)}, ${parseInt(catColor.slice(5, 7) || 'f1', 16)}, 0.15)`,
              color: catColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{budget.category?.name || 'Category'}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Budget</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`badge ${badgeInfo.className}`}>{badgeInfo.label}</span>
          {onEdit && (
            <button
              onClick={() => onEdit(budget)}
              className="btn-icon btn-secondary"
              style={{ width: '32px', height: '32px' }}
              title="Edit Budget"
              aria-label="Edit Budget"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(budget.id)}
              className="btn-icon btn-danger"
              style={{ width: '32px', height: '32px' }}
              title="Delete Budget"
              aria-label="Delete Budget"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Financial Details */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Spent</span>
          <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatCurrency(budget.spentAmount)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Budget Limit</span>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{formatCurrency(budget.budgetAmount)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
          <span style={{ color: budget.isExceeded ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: 600 }}>
            {budget.percentageUsed.toFixed(0)}% used
          </span>
          <span style={{ color: budget.isExceeded ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
            {budget.isExceeded
              ? `${formatCurrency(budget.spentAmount - budget.budgetAmount)} over limit!`
              : `${formatCurrency(budget.remainingAmount)} remaining`}
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${visualPercentage}%`,
              background: budget.isExceeded
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                : budget.percentageUsed >= 80
                ? 'linear-gradient(90deg, #eab308, #f59e0b)'
                : budget.percentageUsed >= 50
                ? 'linear-gradient(90deg, #06b6d4, #3b82f6)'
                : 'linear-gradient(90deg, #10b981, #059669)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
