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
  CreditCard,
  Trash2,
  Edit2,
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

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

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const IconComponent = iconMap[expense.categories?.icon] || Tag;
  const catColor = expense.categories?.color || '#6366f1';

  return (
    <div
      className="glass-card"
      style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {/* Category Icon */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: `rgba(${parseInt(catColor.slice(1, 3) || '63', 16)}, ${parseInt(catColor.slice(3, 5) || '66', 16)}, ${parseInt(catColor.slice(5, 7) || 'f1', 16)}, 0.15)`,
            color: catColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IconComponent size={22} />
        </div>

        {/* Description & metadata */}
        <div style={{ minWidth: 0 }}>
          <h4
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '4px',
            }}
          >
            {expense.description}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              className="badge"
              style={{
                background: `rgba(${parseInt(catColor.slice(1, 3) || '63', 16)}, ${parseInt(catColor.slice(3, 5) || '66', 16)}, ${parseInt(catColor.slice(5, 7) || 'f1', 16)}, 0.12)`,
                color: catColor,
                border: `1px solid rgba(${parseInt(catColor.slice(1, 3) || '63', 16)}, ${parseInt(catColor.slice(3, 5) || '66', 16)}, ${parseInt(catColor.slice(5, 7) || 'f1', 16)}, 0.25)`,
                fontSize: '0.7rem',
              }}
            >
              {expense.categories?.name || 'General'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(expense.expense_date)}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {expense.payment_method || 'Cash'}</span>
          </div>
        </div>
      </div>

      {/* Amount & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <span
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#ef4444',
            letterSpacing: '-0.02em',
          }}
        >
          -{formatCurrency(expense.amount)}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              className="btn-icon btn-secondary"
              style={{ width: '32px', height: '32px' }}
              title="Edit expense"
              aria-label="Edit expense"
            >
              <Edit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(expense.id)}
              className="btn-icon btn-danger"
              style={{ width: '32px', height: '32px' }}
              title="Delete expense"
              aria-label="Delete expense"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
