export const formatPrice = (price) => {
  return `₹${Number(price).toFixed(2)}`;
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Order Received': return 'var(--primary)';
    case 'Preparing': return 'var(--warning)';
    case 'Out for Delivery': return '#00B0FF'; // light blue
    case 'Delivered': return 'var(--success)';
    case 'Cancelled': return 'var(--error)';
    default: return 'var(--text-muted)';
  }
};

export const getStatusStep = (status) => {
  switch (status) {
    case 'Order Received': return 0;
    case 'Preparing': return 1;
    case 'Out for Delivery': return 2;
    case 'Delivered': return 3;
    default: return -1;
  }
};
