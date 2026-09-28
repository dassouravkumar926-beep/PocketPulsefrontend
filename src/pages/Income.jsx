import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PlusCircle,
  TrendingUp,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { incomeService } from '../services/incomeService';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import IncomeForm from '../components/IncomeForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Income = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchIncome = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await incomeService.getIncome({ page, limit: pagination.limit });
      setIncomeList(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load income records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome(1);
  }, []);

  const totalIncomeAmount = incomeList.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const handleAddSubmit = async (data) => {
    await incomeService.createIncome(data);
    setIsAddModalOpen(false);
    fetchIncome(1);
  };

  const handleEditSubmit = async (data) => {
    await incomeService.updateIncome(editingIncome.id, data);
    setEditingIncome(null);
    fetchIncome(pagination.page);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await incomeService.deleteIncome(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchIncome(pagination.page);
    } catch (err) {
      alert('Failed to delete income: ' + (err.response?.data?.message || err.message));
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
          marginBottom: '28px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Income & Allowance</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Keep track of allowance, gifts, jobs, and earnings.
          </p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-success">
          <PlusCircle size={18} />
          <span>Record Income</span>
        </button>
      </div>

      {/* Overview Stat Card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <TrendingUp size={28} />
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Inflow Recorded</span>
          <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.02em' }}>
            +{formatCurrency(totalIncomeAmount)}
          </h3>
        </div>
      </div>

      {error && (
        <div style={{ padding: '14px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Income List */}
      {loading ? (
        <LoadingSpinner message="Loading income records..." />
      ) : incomeList.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No income recorded yet"
          description="Log your pocket money, gifts, or part-time earnings to track your cash flow."
          actionLabel="Record Income"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {incomeList.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>{item.source}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{formatDate(item.income_date)}</span>
                    {item.description && <span>• {item.description}</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>
                  +{formatCurrency(item.amount)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => setEditingIncome(item)}
                    className="btn-icon btn-secondary"
                    style={{ width: '32px', height: '32px' }}
                    title="Edit"
                    aria-label="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="btn-icon btn-danger"
                    style={{ width: '32px', height: '32px' }}
                    title="Delete"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Income Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record New Income"
      >
        <IncomeForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Save Income"
        />
      </Modal>

      {/* Edit Income Modal */}
      <Modal
        isOpen={!!editingIncome}
        onClose={() => setEditingIncome(null)}
        title="Edit Income Record"
      >
        {editingIncome && (
          <IncomeForm
            initialData={editingIncome}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingIncome(null)}
            submitLabel="Update Income"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Income Record"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to delete this income record?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Income;
