import express from 'express';
import { body, param, validationResult } from 'express-validator';
import * as candidateController from '../controllers/candidateController.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all candidates
router.get('/', candidateController.getAllCandidates);

// Get candidate by ID
router.get(
  '/:id',
  param('id').isInt().toInt(),
  handleValidationErrors,
  candidateController.getCandidateById
);

// Search candidates by state
router.get(
  '/search/state/:state',
  param('state').trim().escape(),
  handleValidationErrors,
  candidateController.getCandidatesByState
);

// Search candidates by party
router.get(
  '/search/party/:party',
  param('party').trim().escape(),
  handleValidationErrors,
  candidateController.getCandidatesByParty
);

export default router;
