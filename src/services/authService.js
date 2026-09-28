import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data?.data?.token) {
      localStorage.setItem('teen_tracker_token', response.data.data.token);
      localStorage.setItem('teen_tracker_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.token) {
      localStorage.setItem('teen_tracker_token', response.data.data.token);
      localStorage.setItem('teen_tracker_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err.message);
    } finally {
      localStorage.removeItem('teen_tracker_token');
      localStorage.removeItem('teen_tracker_user');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    if (response.data?.data?.user) {
      localStorage.setItem('teen_tracker_user', JSON.stringify(response.data.data.user));
    }
    return response.data.data.user;
  },
};
