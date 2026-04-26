import express from 'express';
import { body, param, validationResult } from 'express-validator';
import * as registrationController from '../controllers/registrationController.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  next();
};

// Register voter
router.post(
  '/',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('voterId').trim().notEmpty().withMessage('Voter ID is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required')
  ],
  handleValidationErrors,
  registrationController.registerVoter
);

// Check registration status by name, DOB, and state
router.post(
  '/check',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('state').trim().notEmpty().withMessage('State is required')
  ],
  handleValidationErrors,
  registrationController.checkRegistration
);

// Get registration status
router.get(
  '/:voterId',
  param('voterId').trim().escape(),
  handleValidationErrors,
  registrationController.getRegistrationStatus
);

export default router;
