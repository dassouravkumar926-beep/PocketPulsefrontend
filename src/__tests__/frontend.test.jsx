import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { formatCurrency, formatCompactCurrency, getCurrency } from '../utils/currency';
import { formatDate, getMonthName } from '../utils/date';
import { getStatusBadge, getHealthScoreColor } from '../utils/calculations';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import SuggestionCard from '../components/SuggestionCard';

describe('Frontend Utilities and Formatters', () => {
  it('formats currency correctly in Indian Rupee format', () => {
    expect(formatCurrency(1250)).toBe('₹1,250.00');
    expect(formatCurrency(50000)).toBe('₹50,000.00');
    expect(formatCurrency(0)).toBe('₹0.00');
  });

  it('formats compact currency properly', () => {
    expect(formatCompactCurrency(1200)).toBe('₹1.2k');
    expect(formatCompactCurrency(250000)).toBe('₹2.5L');
  });

  it('uses the locally selected currency for amount formatting', () => {
    localStorage.setItem('teen_tracker_currency', 'USD');
    expect(getCurrency()).toBe('USD');
    expect(formatCurrency(1250)).toBe('$1,250.00');
    localStorage.removeItem('teen_tracker_currency');
  });

  it('formats dates properly', () => {
    const formatted = formatDate('2026-09-28');
    expect(formatted).toContain('2026');
    expect(getMonthName(9)).toBe('September');
  });

  it('maps budget status thresholds correctly', () => {
    expect(getStatusBadge('healthy').label).toBe('Healthy');
    expect(getStatusBadge('warning').label).toContain('Warning');
    expect(getStatusBadge('exceeded').label).toContain('Exceeded');
  });

  it('maps health score colors accurately', () => {
    expect(getHealthScoreColor(85)).toBe('#10b981');
    expect(getHealthScoreColor(45)).toBe('#ef4444');
  });
});

describe('Frontend Component Tests', () => {
  it('renders StatCard with title, value, and subtitle', () => {
    render(
      <StatCard
        title="Total Balance"
        value="₹4,250.00"
        subtitle="Available cash"
        badge="Positive"
      />
    );

    expect(screen.getByText('Total Balance')).toBeTruthy();
    expect(screen.getByText('₹4,250.00')).toBeTruthy();
    expect(screen.getByText('Available cash')).toBeTruthy();
    expect(screen.getByText('Positive')).toBeTruthy();
  });

  it('renders EmptyState with custom title and description', () => {
    render(
      <EmptyState
        title="No expenses yet"
        description="Start recording your purchases to see insights."
      />
    );

    expect(screen.getByText('No expenses yet')).toBeTruthy();
    expect(screen.getByText('Start recording your purchases to see insights.')).toBeTruthy();
  });

  it('renders SuggestionCard with title, message, and actionable tip', () => {
    const mockSuggestion = {
      id: 'tip-1',
      title: 'Food budget warning',
      message: "You've used 87% of your food budget this month.",
      severity: 'medium',
      category: 'Food',
      actionableTip: 'Cook at home more often this weekend.',
      reason: 'Budget reached 87%',
    };

    render(<SuggestionCard suggestion={mockSuggestion} />);

    expect(screen.getByText('Food budget warning')).toBeTruthy();
    expect(screen.getByText(/You've used 87% of your food budget/)).toBeTruthy();
    expect(screen.getByText(/Cook at home more often/)).toBeTruthy();
  });
});
