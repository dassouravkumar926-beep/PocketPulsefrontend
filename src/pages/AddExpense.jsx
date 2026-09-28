import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import ExpenseForm from '../components/ExpenseForm';

const AddExpense = () => {
  const navigate = useNavigate();

  const handleExpenseSubmit = async (data) => {
    await expenseService.createExpense(data);
    navigate('/expenses');
  };

  return (
    <div className="page-container" style={{ maxWidth: '640px' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '20px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusCircle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Record New Expense</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Keep tabs on every rupee you spend.
            </p>
          </div>
        </div>

        <ExpenseForm
          onSubmit={handleExpenseSubmit}
          onCancel={() => navigate('/expenses')}
          submitLabel="Save Expense"
        />
      </div>
    </div>
  );
};

export default AddExpense;
