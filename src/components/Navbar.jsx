import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, PlusCircle, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        padding: '0 32px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(11, 15, 25, 0.75)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          className="btn-icon"
          style={{
            display: 'none',
            color: 'var(--text-primary)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
          }}
          id="sidebar-toggle-btn"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'there'} <span style={{ fontSize: '1.2rem' }}>👋</span>
          </h2>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{todayStr} • Financial Overview</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/suggestions" className="btn btn-secondary btn-sm" title="Smart Tips">
          <Sparkles size={16} color="#eab308" />
          <span className="hide-on-mobile">Tips</span>
        </Link>

        <Link to="/expenses/add" className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          <span>Add Expense</span>
        </Link>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #sidebar-toggle-btn {
            display: inline-flex !important;
          }
          header {
            padding: 0 16px !important;
          }
        }
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
