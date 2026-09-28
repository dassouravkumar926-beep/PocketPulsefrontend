import api from './api';

export const dashboardService = {
  async getDashboard(params = {}) {
    const response = await api.get('/dashboard', { params });
    return response.data;
  },

  async getSummary(params = {}) {
    const response = await api.get('/dashboard/summary', { params });
    return response.data;
  },

  async getRecentTransactions(limit = 10) {
    const response = await api.get('/dashboard/recent-transactions', { params: { limit } });
    return response.data;
  },

  async getCategoryAnalytics(params = {}) {
    const response = await api.get('/analytics/category', { params });
    return response.data;
  },

  async getMonthlyTrend(months = 6) {
    const response = await api.get('/analytics/monthly', { params: { months } });
    return response.data;
  },

  async getDailySpending(params = {}) {
    const response = await api.get('/analytics/daily', { params });
    return response.data;
  },

  async getBudgetVsActual(month, year) {
    const response = await api.get('/analytics/budget-vs-actual', { params: { month, year } });
    return response.data;
  },

  async getSuggestions() {
    const response = await api.get('/suggestions');
    return response.data;
  },
};
