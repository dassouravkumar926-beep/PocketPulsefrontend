import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { formatCurrency } from '../utils/currency';
import SpendingChart from '../components/SpendingChart';
import LoadingSpinner from '../components/LoadingSpinner';

const timeframeOptions = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: '3months', label: 'Last 3 Months' },
];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('this_month');
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [budgetVsActual, setBudgetVsActual] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catRes, trendRes, dailyRes, bvaRes] = await Promise.all([
          dashboardService.getCategoryAnalytics({ timeframe }),
          dashboardService.getMonthlyTrend(6),
          dashboardService.getDailySpending({ timeframe }),
          dashboardService.getBudgetVsActual(),
        ]);

        setCategoryData(catRes.data?.categories || []);
        setMonthlyTrend(trendRes.data || []);
        setDailyData(dailyRes.data || []);
        setBudgetVsActual(bvaRes.data?.comparison || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load visual analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe]);

  if (loading) {
    return <LoadingSpinner message="Rendering graphical financial analytics..." size="lg" />;
  }

  return (
    <div className="page-container">
      {/* Header & Filter Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Visual Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Interactive charts answering where your pocket money goes and how your savings grow.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            gap: '4px',
          }}
        >
          {timeframeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className="btn btn-sm"
              style={{
                background: timeframe === opt.value ? 'var(--primary)' : 'transparent',
                color: timeframe === opt.value ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: timeframe === opt.value ? 700 : 500,
                fontSize: '0.8rem',
                padding: '6px 14px',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '14px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Row 1: Category Spending & Daily Spending */}
      <div className="grid-charts">
        {/* Chart 1: Donut Category Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <PieIcon size={18} color="#6366f1" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Where Is My Money Going?</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Proportion of expenses across categories for {timeframeOptions.find(t => t.value === timeframe)?.label}.
          </p>
          <SpendingChart type="category" data={categoryData} height={280} />
        </div>

        {/* Chart 4: Daily Spending Trend */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Activity size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Daily Spending Activity</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Identify which days saw spending spikes or quiet days.
          </p>
          <SpendingChart type="daily" data={dailyData} height={280} />
        </div>
      </div>

      {/* Row 2: Monthly Trend & Income vs Expense */}
      <div className="grid-charts">
        {/* Chart 2: Monthly Trend (Expenses vs Income vs Savings) */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrendingUp size={18} color="#10b981" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Spending & Savings Trajectory</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Month-over-month curve showing cash flow and net savings rate.
          </p>
          <SpendingChart type="monthly" data={monthlyTrend} height={280} />
        </div>

        {/* Chart 3: Income vs Expenses Comparative Bar Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BarChart3 size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Income vs Expenses</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Direct comparison between incoming money and outgoing expenses.
          </p>
          <SpendingChart type="income-vs-expense" data={monthlyTrend} height={280} />
        </div>
      </div>

      {/* Row 3: Budget vs Actual Bar Chart */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Layers size={18} color="#ec4899" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Budget vs Actual Category Spending</h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Are you staying within your assigned category limits this month?
        </p>
        <SpendingChart type="budget-vs-actual" data={budgetVsActual} height={280} />
      </div>
    </div>
  );
};

export default Analytics;
