import express from 'express';
import { param, validationResult } from 'express-validator';
import * as timelineController from '../controllers/timelineController.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get timeline for all states
router.get('/', timelineController.getTimelineAll);

// Get timeline for specific state
router.get(
  '/:state',
  param('state').trim().escape(),
  handleValidationErrors,
  timelineController.getTimelineByState
);

export default router;
