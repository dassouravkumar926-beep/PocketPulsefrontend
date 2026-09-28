import React, { useState } from 'react';
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
  TrendingUp,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import EmptyState from './EmptyState';

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
  TrendingUp,
};

const TransactionList = ({ transactions = [], title = 'Recent Transactions', showSearch = false }) => {
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.description.toLowerCase().includes(q) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{title}</h3>

        {showSearch && (
          <div style={{ position: 'relative', width: '220px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search..."
              className="form-input"
              style={{ paddingLeft: '36px', paddingRight: '12px', height: '36px', fontSize: '0.85rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Record an expense or income to see your activity log."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((t) => {
            const isIncome = t.type === 'income';
            const IconComponent = iconMap[t.icon] || (isIncome ? TrendingUp : Tag);
            const color = isIncome ? '#10b981' : t.color || '#ef4444';

            return (
              <div
                key={`${t.type}-${t.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  transition: 'background 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: `rgba(${parseInt(color.slice(1, 3) || '10', 16)}, ${parseInt(color.slice(3, 5) || 'b9', 16)}, ${parseInt(color.slice(5, 7) || '81', 16)}, 0.15)`,
                      color: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={20} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '0.925rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {t.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{t.category}</span>
                      <span>•</span>
                      <span>{formatDate(t.date || t.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: isIncome ? 'var(--success)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px',
                    }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {t.payment_method || (isIncome ? 'Direct' : 'Cash')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
