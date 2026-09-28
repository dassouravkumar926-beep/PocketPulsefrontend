const configuredCurrency = import.meta.env.VITE_CURRENCY || 'INR';

export const getCurrency = () => {
  return localStorage.getItem('teen_tracker_currency') || configuredCurrency;
};

export const getCurrencySymbol = () => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: getCurrency(),
    maximumFractionDigits: 0,
  })
    .formatToParts(0)
    .find((part) => part.type === 'currency').value;
};

export const formatCurrency = (amount, currency = getCurrency()) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

  if (currency === 'INR') {
    return `₹${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(num);
};

export const formatCompactCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const currency = getCurrency();

  if (currency === 'INR') {
    if (Math.abs(num) >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (Math.abs(num) >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (Math.abs(num) >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
    return `₹${num.toFixed(0)}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};
