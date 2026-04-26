export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).replace(/(\d+),/, '$1').trim()
};

export const formatTime = (time) => {
  return new Date(time).toLocaleTimeString();
};

export const isEligibleToVote = (age) => {
  if (typeof age !== 'number' || age < 0) return false
  return age >= 18
};

export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return ''
  // Remove script tags and their content
  let sanitized = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Remove other HTML tags
  sanitized = sanitized.replace(/<[^>]+>/g, '')
  // Trim whitespace
  sanitized = sanitized.trim()
  return sanitized
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  formatDate,
  formatTime,
  isEligibleToVote,
  sanitizeInput,
  debounce,
  throttle,
};
