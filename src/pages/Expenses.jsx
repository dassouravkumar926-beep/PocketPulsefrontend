import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { expenseService } from '../services/expenseService';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseForm from '../components/ExpenseForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const paymentOptions = ['All', 'Cash', 'UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Allowance', 'Other'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [sortBy, setSortBy] = useState('expense_date');
  const [order, setOrder] = useState('desc');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Load categories
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await expenseService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    loadCats();
  }, []);

  // Fetch expenses with active filters
  const fetchExpenses = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: pagination.limit,
        sort_by: sortBy,
        order,
      };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category_id = selectedCategory;
      if (selectedPayment !== 'All') params.payment_method = selectedPayment;

      const res = await expenseService.getExpenses(params);
      setExpenses(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(1);
  }, [search, selectedCategory, selectedPayment, sortBy, order]);

  // Handle Add Expense
  const handleAddSubmit = async (data) => {
    await expenseService.createExpense(data);
    setIsAddModalOpen(false);
    fetchExpenses(1);
  };

  // Handle Edit Expense
  const handleEditSubmit = async (data) => {
    await expenseService.updateExpense(editingExpense.id, data);
    setEditingExpense(null);
    fetchExpenses(pagination.page);
  };

  // Handle Delete Expense
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await expenseService.deleteExpense(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchExpenses(pagination.page);
    } catch (err) {
      alert('Failed to delete expense: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Expense History</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Filter, search, and manage your daily expenses.
          </p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search description..."
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px', fontSize: '0.9rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Dropdown Filter */}
        <div style={{ flex: '1 1 150px' }}>
          <select
            className="form-select"
            style={{ height: '40px', fontSize: '0.875rem' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div style={{ flex: '1 1 150px' }}>
          <select
            className="form-select"
            style={{ height: '40px', fontSize: '0.875rem' }}
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            {paymentOptions.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'All Payments' : p}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div style={{ flex: '1 1 150px' }}>
          <select
            className="form-select"
            style={{ height: '40px', fontSize: '0.875rem' }}
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [sb, ord] = e.target.value.split('-');
              setSortBy(sb);
              setOrder(ord);
            }}
          >
            <option value="expense_date-desc">Newest Date First</option>
            <option value="expense_date-asc">Oldest Date First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ padding: '14px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Expense List */}
      {loading ? (
        <LoadingSpinner message="Loading your expenses..." />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses found"
          description={search || selectedCategory !== 'All' ? 'Try adjusting your filters or search term.' : 'Start tracking your spending by adding your first expense!'}
          actionLabel="Add Expense"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div>
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={(exp) => setEditingExpense(exp)}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          ))}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '24px',
                padding: '12px 16px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} items)
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => fetchExpenses(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: pagination.page <= 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  onClick={() => fetchExpenses(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Add Expense"
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            initialData={editingExpense}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingExpense(null)}
            submitLabel="Update Expense"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Expense"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to permanently delete this expense? This will update your balance and budget analytics.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="btn btn-danger">
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
