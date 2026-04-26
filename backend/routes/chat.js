import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { askGemini } from '../services/geminiService.js';

const router = express.Router();

// Chat-specific rate limiter: 20 requests per 15 minutes
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many chat requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0]?.msg || 'Invalid request' });
  }
  next();
};

const INJECTION_PATTERNS = [
  'ignore previous instructions',
  'ignore all previous instructions',
  'disregard previous instructions',
  'system prompt',
  'reveal system prompt',
  'bypass safety'
];

const blockPromptInjection = (req, res, next) => {
  const message = String(req.body?.message || '').toLowerCase();
  const blocked = INJECTION_PATTERNS.some((pattern) => message.includes(pattern));

  if (blocked) {
    return res.status(400).json({ error: 'Message contains disallowed instructions.' });
  }

  next();
};

// POST /api/chat - Send message to AI assistant
router.post(
  '/',
  chatLimiter,
  [
    body('message')
      .isString()
      .withMessage('Message must be a string')
      .trim()
      .notEmpty()
      .withMessage('Message cannot be empty')
      .isLength({ max: 500 })
      .withMessage('Message must not exceed 500 characters'),
    body('history')
      .optional()
      .isArray()
      .withMessage('History must be an array')
  ],
  handleValidationErrors,
  blockPromptInjection,
  async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      const reply = await askGemini(message, history);
      return res.status(200).json({ reply });
    } catch (error) {
      console.error('Chat route error:', error);
      return res.status(500).json({ reply: "Sorry, I couldn't process your request." });
    }
  }
);

export default router;
