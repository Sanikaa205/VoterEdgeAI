import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/candidates.json');

// Load candidates from JSON file
const loadCandidates = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Sanitize and validate query parameter
const sanitizeParam = (param) => {
  return String(param || '').trim().replace(/[<>]/g, '').substring(0, 100);
};

// Get all candidates (with optional filtering by state and/or party)
export const getAllCandidates = (req, res) => {
  try {
    const { state, party } = req.query;
    let candidates = loadCandidates();

    if (!Array.isArray(candidates)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid data format'
      });
    }

    // Filter by state if provided (validated & sanitized)
    if (state) {
      const sanitizedState = sanitizeParam(state);
      candidates = candidates.filter(
        c => c.state && c.state.toLowerCase() === sanitizedState.toLowerCase()
      );
    }

    // Filter by party if provided (validated & sanitized)
    if (party) {
      const sanitizedParty = sanitizeParam(party);
      candidates = candidates.filter(
        c => c.party && c.party.toLowerCase() === sanitizedParty.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      message: 'Candidates retrieved successfully',
      count: candidates.length,
      data: candidates || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve candidates'
    });
  }
};

// Get candidate by ID
export const getCandidateById = (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a number
    const candidateId = parseInt(id, 10);
    if (isNaN(candidateId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid candidate ID'
      });
    }

    const candidates = loadCandidates();

    if (!Array.isArray(candidates)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid data format'
      });
    }

    const candidate = candidates.find(c => c.id === candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidate retrieved successfully',
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve candidate'
    });
  }
};

// Get candidates by state
export const getCandidatesByState = (req, res) => {
  try {
    const { state } = req.params;
    const candidates = loadCandidates();
    
    const filteredCandidates = candidates.filter(
      c => c.state.toLowerCase() === state.toLowerCase()
    );
    
    if (filteredCandidates.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No candidates found for this state'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Candidates from ${state} retrieved successfully`,
      count: filteredCandidates.length,
      data: filteredCandidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get candidates by party
export const getCandidatesByParty = (req, res) => {
  try {
    const { party } = req.params;
    const candidates = loadCandidates();
    
    const filteredCandidates = candidates.filter(
      c => c.party.toLowerCase() === party.toLowerCase()
    );
    
    if (filteredCandidates.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No candidates found for this party'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Candidates from ${party} retrieved successfully`,
      count: filteredCandidates.length,
      data: filteredCandidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
