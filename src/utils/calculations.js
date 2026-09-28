/**
 * Calculations helper for status colors and badge utilities on the frontend
 */

export const getStatusBadge = (status) => {
  switch (status) {
    case 'healthy':
      return { label: 'Healthy', className: 'badge-success', color: '#10b981' };
    case 'approaching':
      return { label: 'Approaching Limit', className: 'badge-info', color: '#3b82f6' };
    case 'warning':
      return { label: 'Warning (80%+)', className: 'badge-warning', color: '#f59e0b' };
    case 'exceeded':
      return { label: 'Exceeded!', className: 'badge-danger', color: '#ef4444' };
    default:
      return { label: 'Normal', className: 'badge-neutral', color: '#64748b' };
  }
};

export const getHealthScoreColor = (score) => {
  if (score >= 80) return '#10b981'; // green
  if (score >= 65) return '#3b82f6'; // blue
  if (score >= 50) return '#f59e0b'; // amber
  return '#ef4444'; // red
};
