import express from 'express';
import { param, query, body, validationResult } from 'express-validator';
import * as boothController from '../controllers/boothController.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all polling booths
router.get('/', boothController.getAllBooths);

// Get booths nearby (by coordinates)
router.get(
  '/nearby',
  [
    query('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be a number between -90 and 90'),
    query('lng')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be a number between -180 and 180')
  ],
  handleValidationErrors,
  boothController.getBoothsNearby
);

// Get booth by ID
router.get(
  '/:id',
  param('id').isInt().toInt(),
  handleValidationErrors,
  boothController.getBoothById
);

// Find nearby booths by state
router.get(
  '/location/:state',
  param('state').trim().escape(),
  handleValidationErrors,
  boothController.getBoothsByState
);

export default router;
