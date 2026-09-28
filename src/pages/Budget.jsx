import React, { useState, useEffect } from 'react';
import {
  Target,
  PlusCircle,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { budgetService } from '../services/budgetService';
import { expenseService } from '../services/expenseService';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { getMonthName } from '../utils/date';
import BudgetCard from '../components/BudgetCard';
import SpendingChart from '../components/SpendingChart';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Budget = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [budgetData, setBudgetData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
  });

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await budgetService.getBudgets({ month: selectedMonth, year: selectedYear });
      setBudgetData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await expenseService.getCategories();
        setCategories(res.data || []);
        if (res.data?.length > 0 && !formData.category_id) {
          setFormData((prev) => ({ ...prev, category_id: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCats();
  }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!formData.category_id || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please select a category and enter a valid budget amount');
      return;
    }

    try {
      await budgetService.setBudget({
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        month: selectedMonth,
        year: selectedYear,
      });
      setIsAddModalOpen(false);
      setEditingBudget(null);
      setFormData({ category_id: categories[0]?.id || '', amount: '' });
      fetchBudgets();
    } catch (err) {
      alert('Failed to set budget: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditClick = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category_id: budget.category_id,
      amount: budget.budgetAmount,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await budgetService.deleteBudget(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchBudgets();
    } catch (err) {
      alert('Failed to delete budget: ' + (err.response?.data?.message || err.message));
    }
  };

  const summary = budgetData?.summary || {
    totalBudgeted: 0,
    totalSpentInBudgets: 0,
    totalRemaining: 0,
    overallPercentage: 0,
  };

  // Prepare chart comparison data
  const comparisonData = (budgetData?.data || []).map((b) => ({
    category: b.category?.name || 'Category',
    budgeted: b.budgetAmount,
    actual: b.spentAmount,
  }));

  return (
    <div className="page-container">
      {/* Header & Month Selector */}
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
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Monthly Budgets</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Set category spending limits and monitor utilization progress.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Month Dropdown */}
          <select
            className="form-select"
            style={{ width: '150px', height: '40px' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {getMonthName(m)}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            className="form-select"
            style={{ width: '100px', height: '40px' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setEditingBudget(null);
              setFormData({ category_id: categories[0]?.id || '', amount: '' });
              setIsAddModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <PlusCircle size={18} />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-stats">
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Budgeted</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px' }}>
            {formatCurrency(summary.totalBudgeted)}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All categories combined</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Spent</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: '#ef4444' }}>
            {formatCurrency(summary.totalSpentInBudgets)}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {summary.overallPercentage.toFixed(0)}% of total budget used
          </span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Remaining Pool</span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--success)' }}>
            {formatCurrency(summary.totalRemaining)}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Available to spend</span>
        </div>
      </div>

      {/* Budget vs Actual Comparison Chart */}
      {comparisonData.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Budget vs Actual Spending</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {getMonthName(selectedMonth)} {selectedYear}
            </span>
          </div>
          <SpendingChart type="budget-vs-actual" data={comparisonData} height={280} />
        </div>
      )}

      {error && (
        <div style={{ padding: '14px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Budgets Grid */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
        Category Budgets ({budgetData?.data?.length || 0})
      </h3>

      {loading ? (
        <LoadingSpinner message="Calculating budget tracking..." />
      ) : budgetData?.data?.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No budgets set for this month"
          description={`Set spending limits for ${getMonthName(selectedMonth)} to keep your expenses under control.`}
          actionLabel="Create First Budget"
          onAction={() => {
            setEditingBudget(null);
            setIsAddModalOpen(true);
          }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {budgetData.data.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEditClick}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          ))}
        </div>
      )}

      {/* Set / Edit Budget Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Monthly Budget' : 'Set Category Budget'}
      >
        <form onSubmit={handleSetBudget} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="budget-cat">Category *</label>
            <select
              id="budget-cat"
              className="form-select"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              disabled={!!editingBudget}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="budget-amount">Monthly Spending Limit ({getCurrencySymbol()}) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.1rem' }}>
                {getCurrencySymbol()}
              </span>
              <input
                id="budget-amount"
                type="number"
                step="1"
                min="1"
                placeholder="2000"
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '1.1rem', fontWeight: 600 }}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingBudget(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingBudget ? 'Update Budget' : 'Save Budget'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Remove Budget"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to remove this budget? Your past expenses will remain recorded, but this limit will no longer be tracked.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="btn btn-danger">
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Budget;
