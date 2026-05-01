/**
 * Input Validation Utilities
 * Provides functions to validate and sanitize user inputs
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

const validateVoterId = (voterId) => {
  // Indian voter ID format (16 digits)
  const voterIdRegex = /^\d{10}[A-Z]{1}\d{4}$/;
  return voterIdRegex.test(String(voterId).trim());
};

const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  // Remove leading/trailing whitespace
  let s = String(text).trim();
  // Remove '<' characters (opening tag markers)
  s = s.replace(/</g, '');
  // Remove characters that are not letters, numbers, spaces, '>' or '/'
  s = s.replace(/[^A-Za-z0-9\s>/]/g, '');
  // Limit length
  return s.substring(0, 500);
};

const validateState = (state) => {
  const validStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
  ];
  return validStates.includes(String(state).trim());
};

const validateName = (name) => {
  const sanitized = sanitizeText(name);
  return sanitized.length >= 2 && sanitized.length <= 100;
};

export {
  validateEmail,
  validateVoterId,
  sanitizeText,
  validateState,
  validateName
};
