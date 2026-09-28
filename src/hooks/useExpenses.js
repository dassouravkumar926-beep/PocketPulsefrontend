import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';

export const useExpenses = (initialFilters = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await expenseService.getExpenses(filters);
      setExpenses(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (data) => {
    const res = await expenseService.createExpense(data);
    await fetchExpenses();
    return res;
  };

  const updateExpense = async (id, data) => {
    const res = await expenseService.updateExpense(id, data);
    await fetchExpenses();
    return res;
  };

  const deleteExpense = async (id) => {
    const res = await expenseService.deleteExpense(id);
    await fetchExpenses();
    return res;
  };

  return {
    expenses,
    pagination,
    filters,
    setFilters,
    loading,
    error,
    refresh: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};
