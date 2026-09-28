import React, { useState } from 'react';
import { getTodayDateInput } from '../utils/date';
import { getCurrencySymbol } from '../utils/currency';
import { PlusCircle, Save } from 'lucide-react';

const commonSources = [
  'Monthly Allowance',
  'Part-time Job',
  'Birthday / Festival Gift',
  'Scholarship',
  'Freelance / Tutoring',
  'Selling Old Items',
  'Other',
];

const IncomeForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Record Income' }) => {
  const [formData, setFormData] = useState({
    source: initialData?.source || 'Monthly Allowance',
    customSource: '',
    amount: initialData?.amount || '',
    income_date: initialData?.income_date || getTodayDateInput(),
    description: initialData?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const finalSource = formData.source === 'Other' ? formData.customSource : formData.source;
    if (!finalSource || !finalSource.trim()) {
      errs.source = 'Income source is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errs.amount = 'Please enter an amount greater than 0';
    }
    if (!formData.income_date) {
      errs.income_date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const finalSource = formData.source === 'Other' ? formData.customSource.trim() : formData.source;
      await onSubmit({
        source: finalSource,
        amount: parseFloat(formData.amount),
        income_date: formData.income_date,
        description: formData.description.trim(),
      });
    } catch (err) {
      setErrors({ form: err.response?.data?.message || err.message || 'Failed to save income' });
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
        <label className="form-label" htmlFor="income-amount">Income Amount ({getCurrencySymbol()}) *</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.1rem' }}>
            {getCurrencySymbol()}
          </span>
          <input
            id="income-amount"
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

      {/* Source Selection */}
      <div className="form-group">
        <label className="form-label" htmlFor="income-source">Income Source *</label>
        <select
          id="income-source"
          className="form-select"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
        >
          {commonSources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {formData.source === 'Other' && (
          <input
            type="text"
            placeholder="Specify income source..."
            className="form-input"
            style={{ marginTop: '8px' }}
            value={formData.customSource}
            onChange={(e) => setFormData({ ...formData, customSource: e.target.value })}
            required
          />
        )}
        {errors.source && <span className="form-error">{errors.source}</span>}
      </div>

      {/* Income Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="income-date">Date Received</label>
        <input
          id="income-date"
          type="date"
          className="form-input"
          value={formData.income_date}
          onChange={(e) => setFormData({ ...formData, income_date: e.target.value })}
          required
        />
        {errors.income_date && <span className="form-error">{errors.income_date}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="income-description">Notes / Description (Optional)</label>
        <input
          id="income-description"
          type="text"
          placeholder="e.g. Pocket money, freelancing project"
          className="form-input"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-success" disabled={loading}>
          {initialData ? <Save size={18} /> : <PlusCircle size={18} />}
          <span>{loading ? 'Saving...' : submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;
