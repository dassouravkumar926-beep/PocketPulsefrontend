import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { getTodayDateInput } from '../utils/date';
import { getCurrencySymbol } from '../utils/currency';
import { PlusCircle, Save } from 'lucide-react';

const paymentMethods = ['UPI', 'Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'Allowance', 'Other'];

const ExpenseForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save Expense' }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    category_id: initialData?.category_id || '',
    expense_date: initialData?.expense_date || getTodayDateInput(),
    payment_method: initialData?.payment_method || 'UPI',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await expenseService.getCategories();
        setCategories(res.data || []);
        if (!formData.category_id && res.data?.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.description.trim()) {
      errs.description = 'Description is required';
    }
    if (!formData.category_id) {
      errs.category_id = 'Please select a category';
    }
    if (!formData.expense_date) {
      errs.expense_date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } catch (err) {
      setErrors({ form: err.response?.data?.message || err.message || 'Failed to save expense' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {errors.form && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
          {errors.form}
        </div>
      )}

      {/* Amount Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-amount">Amount ({getCurrencySymbol()}) *</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.1rem' }}>
            {getCurrencySymbol()}
          </span>
          <input
            id="expense-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '1.1rem', fontWeight: 600 }}
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      {/* Description Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-description">Description *</label>
        <input
          id="expense-description"
          type="text"
          placeholder="e.g. McDonald's burger, Metro recharge, Books"
          className="form-input"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {/* Category Selection */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-category">Category *</label>
        <select
          id="expense-category"
          className="form-select"
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && <span className="form-error">{errors.category_id}</span>}
      </div>

      {/* Date & Payment Method row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="expense-date">Expense Date</label>
          <input
            id="expense-date"
            type="date"
            className="form-input"
            value={formData.expense_date}
            onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
            required
          />
          {errors.expense_date && <span className="form-error">{errors.expense_date}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense-payment">Payment Method</label>
          <select
            id="expense-payment"
            className="form-select"
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit / Cancel Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {initialData ? <Save size={18} /> : <PlusCircle size={18} />}
          <span>{loading ? 'Saving...' : submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
