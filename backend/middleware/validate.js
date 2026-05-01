/**
 * Input Validation Middleware
 * Validates and sanitizes incoming request data
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '').substring(0, 500);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

const validateVoterId = (voterId) => {
  const voterIdRegex = /^\d{10}[A-Z]{1}\d{4}$/;
  return voterIdRegex.test(String(voterId).trim());
};

const validate = (req, res, next) => {
  const { name, email, voterId } = req.body;

  // Check required fields
  if (!name || !email || !voterId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, voterId'
    });
  }

  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }

  // Validate voter ID
  if (!validateVoterId(voterId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid voter ID format'
    });
  }

  // Validate name (2-100 characters)
  const sanitizedName = sanitizeString(name);
  if (sanitizedName.length < 2 || sanitizedName.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Name must be between 2 and 100 characters'
    });
  }

  // Store sanitized values back in request
  req.body.name = sanitizedName;
  req.body.email = email.toLowerCase();
  req.body.voterId = voterId.trim();

  next();
};

module.exports = { validate, sanitizeString, validateEmail, validateVoterId };
