const validate = (req, res, next) => {
  const { name, email, voterId } = req.body;

  // Basic validation
  if (!name || !email || !voterId) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, email, voterId' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

module.exports = { validate };
