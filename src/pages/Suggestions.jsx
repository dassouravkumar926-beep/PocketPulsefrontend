import React, { useState, useEffect } from 'react';
import { Sparkles, Filter, CheckCircle2, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import SuggestionCard from '../components/SuggestionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const severityFilters = [
  { value: 'all', label: 'All Tips' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Warnings' },
  { value: 'info', label: 'Insights' },
  { value: 'low', label: 'Good Habits' },
];

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dashboardService.getSuggestions();
        setSuggestions(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load smart spending tips');
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  const filtered = suggestions.filter((s) => {
    if (filter === 'all') return true;
    return s.severity === filter;
  });

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={22} fill="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Smart Spending Suggestions</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.5 }}>
          Personalized, non-judgmental financial recommendations derived from your actual spending, budgets, and savings patterns.
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px',
        }}
      >
        {severityFilters.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className="btn btn-sm"
            style={{
              background: filter === tab.value ? 'var(--primary)' : 'var(--bg-card)',
              color: filter === tab.value ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '14px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Suggestions List */}
      {loading ? (
        <LoadingSpinner message="Analyzing transactions and compiling suggestions..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No alerts in this category"
          description="Everything looks balanced! Keep recording your daily transactions to keep your tips fresh."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((item) => (
            <SuggestionCard key={item.id} suggestion={item} />
          ))}
        </div>
      )}

      {/* Educational Banner */}
      <div
        className="glass-card"
        style={{
          marginTop: '36px',
          padding: '20px 24px',
          background: 'rgba(99, 102, 241, 0.08)',
          borderColor: 'rgba(99, 102, 241, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: '2rem' }}>🎓</span>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
            Built for Financial Awareness
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Our recommendation engine analyzes your category spending, recurring subscriptions, and budget limits to help you practice healthy habits. Tips are always constructive and objective.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
