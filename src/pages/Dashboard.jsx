import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Clock,
  Flame,
  Award,
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { formatCurrency } from '../utils/currency';
import StatCard from '../components/StatCard';
import SpendingChart from '../components/SpendingChart';
import TransactionList from '../components/TransactionList';
import SuggestionCard from '../components/SuggestionCard';
import HealthScoreCard from '../components/HealthScoreCard';
import LoadingSpinner from '../components/LoadingSpinner';

const timeframeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: '3months', label: 'Last 3 Months' },
];

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('this_month');
  const [dashboardData, setDashboardData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dashRes, catRes, trendRes, tipsRes, budgetRes] = await Promise.all([
          dashboardService.getDashboard({ timeframe }),
          dashboardService.getCategoryAnalytics({ timeframe }),
          dashboardService.getMonthlyTrend(6),
          dashboardService.getSuggestions(),
          dashboardService.getBudgetVsActual(),
        ]);

        setDashboardData(dashRes.data);
        setCategoryData(catRes.data?.categories || []);
        setMonthlyTrend(trendRes.data || []);
        setSuggestions((tipsRes.data || []).slice(0, 3));
        setBudgets((budgetRes.data?.comparison || []).slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, [timeframe]);

  if (loading && !dashboardData) {
    return <LoadingSpinner message="Calculating your spending overview..." size="lg" />;
  }

  const summary = dashboardData?.summary || {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savings: 0,
    savingsRate: 0,
    dailyAverage: 0,
    largestExpense: null,
    topCategory: null,
  };

  return (
    <div className="page-container">
      {/* Timeframe Filter Bar */}
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
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Financial Overview</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time tracking of your pocket money, expenses, and savings.
          </p>
        </div>

        {/* Timeframe Buttons */}
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
                padding: '6px 12px',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '14px 18px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* 4 Top Financial Stat Cards */}
      <div className="grid-stats">
        <StatCard
          title="Total Balance"
          value={formatCurrency(summary.balance)}
          subtitle="Net cash available"
          icon={Wallet}
          color="#6366f1"
          badge={summary.balance >= 0 ? 'Positive' : 'Deficit'}
        />

        <StatCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          subtitle="Allowance & earnings"
          icon={ArrowDownLeft}
          color="#10b981"
          trend={{ direction: 'up', label: '+Recorded' }}
        />

        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          subtitle="Money spent"
          icon={ArrowUpRight}
          color="#ef4444"
          trend={{ direction: 'down', label: '-Outflow' }}
        />

        <StatCard
          title="Total Savings"
          value={formatCurrency(summary.savings)}
          subtitle={`${summary.savingsRate}% of income saved`}
          icon={PiggyBank}
          color="#06b6d4"
          badge={summary.savingsRate >= 20 ? 'Great Habit' : 'Tracking'}
        />
      </div>

      {/* Secondary Metrics Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Average</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(summary.dailyAverage)}/day</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Largest Expense</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {summary.largestExpense ? formatCurrency(summary.largestExpense.amount) : 'None'}
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Category</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {summary.topCategory ? summary.topCategory.name : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid-charts">
        {/* Monthly Trend */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Monthly Spending Trend</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 6 Months</span>
          </div>
          <SpendingChart type="monthly" data={monthlyTrend} height={260} />
        </div>

        {/* Spending by Category Donut */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Spending by Category</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{timeframeOptions.find(t => t.value === timeframe)?.label}</span>
          </div>
          <SpendingChart type="category" data={categoryData} height={260} />
        </div>
      </div>

      {/* 2-Column: Health Score & Budget Progress */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Spending Health Score */}
        <HealthScoreCard healthScore={dashboardData?.healthScore} />

        {/* Budget Progress Preview */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Monthly Budget Progress</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live category tracking</span>
            </div>
            <Link to="/budget" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
              Manage <ArrowRight size={14} />
            </Link>
          </div>

          {budgets.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 10px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                No budgets set for this month yet. Setting budgets helps build discipline!
              </p>
              <Link to="/budget" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Set Budget
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              {budgets.map((b, idx) => {
                const percent = Math.min(100, Math.max(0, b.percentageUsed));
                const isOver = b.actual > b.budgeted;
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600 }}>{b.category}</span>
                      <span style={{ color: isOver ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        {formatCurrency(b.actual)} / {formatCurrency(b.budgeted)} ({b.percentageUsed.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${percent}%`,
                          background: isOver
                            ? 'var(--danger)'
                            : b.percentageUsed >= 80
                            ? 'var(--warning)'
                            : 'var(--success)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Smart Suggestions Preview */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#eab308" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Smart Spending Tips</h3>
          </div>
          <Link to="/suggestions" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
            View all insights <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {suggestions.map((tip) => (
            <SuggestionCard key={tip.id} suggestion={tip} />
          ))}
        </div>
      </div>

      {/* Recent Transactions List */}
      <TransactionList
        transactions={dashboardData?.recentTransactions || []}
        title="Recent Transactions"
        showSearch={false}
      />
    </div>
  );
};

export default Dashboard;
