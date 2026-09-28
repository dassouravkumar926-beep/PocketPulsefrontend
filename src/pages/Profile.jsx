import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/date';
import { User, Shield, KeyRound, IndianRupee, LogOut, CheckCircle2 } from 'lucide-react';
import { getCurrency } from '../utils/currency';

const currencyOptions = [
  ['INR', 'Indian Rupee (INR)'],
  ['USD', 'US Dollar (USD)'],
  ['EUR', 'Euro (EUR)'],
  ['GBP', 'British Pound (GBP)'],
  ['CAD', 'Canadian Dollar (CAD)'],
  ['AUD', 'Australian Dollar (AUD)'],
];

const Profile = () => {
  const { user, logout } = useAuth();
  const [currency, setCurrency] = useState(getCurrency);

  const handleCurrencyChange = (event) => {
    const nextCurrency = event.target.value;
    setCurrency(nextCurrency);
    localStorage.setItem('teen_tracker_currency', nextCurrency);
  };

  return (
    <div className="page-container" style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Account & Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your personal details and application preferences.
        </p>
      </div>

      {/* User Card */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user?.name || 'Teenager'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <span className="badge badge-info">{user?.age ? `${user.age} Years Old` : 'Teenager'}</span>
              <span className="badge badge-success">Active Member</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Email</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user?.email}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member Since</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatDate(user?.created_at || new Date())}</p>
          </div>
        </div>
      </div>

      {/* Currency & Locale Preferences */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <IndianRupee size={20} color="#10b981" />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Default Currency</h4>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
          Choose how amounts are displayed on this device. This does not change amounts already recorded.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label className="sr-only" htmlFor="profile-currency">Display currency</label>
          <select
            id="profile-currency"
            className="form-select"
            value={currency}
            onChange={handleCurrencyChange}
            style={{ maxWidth: '320px' }}
          >
            {currencyOptions.map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          <CheckCircle2 size={18} color="#10b981" aria-label="Currency preference saved" />
        </div>
      </div>

      {/* Security Info */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={20} color="#6366f1" />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Security & Data Isolation</h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={16} color="var(--primary)" />
            <span>Passwords protected with one-way salted <strong>bcrypt</strong> hashing (10 rounds).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="var(--primary)" />
            <span>API endpoints secured with signed JSON Web Tokens (JWT).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--primary)" />
            <span>Strict user ownership verification ensures complete privacy of your financial records.</span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button onClick={logout} className="btn btn-danger" style={{ width: '100%', padding: '12px' }}>
        <LogOut size={18} />
        <span>Log Out of Account</span>
      </button>
    </div>
  );
};

export default Profile;
