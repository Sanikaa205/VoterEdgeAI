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
    console.error('Error loading candidates:', error);
    return [];
  }
};

// Get all candidates (with optional filtering by state and/or party)
export const getAllCandidates = (req, res) => {
  try {
    const { state, party } = req.query;
    let candidates = loadCandidates();
    
    // Filter by state if provided
    if (state) {
      candidates = candidates.filter(
        c => c.state.toLowerCase() === state.toLowerCase()
      );
    }
    
    // Filter by party if provided
    if (party) {
      candidates = candidates.filter(
        c => c.party.toLowerCase() === party.toLowerCase()
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Candidates retrieved successfully',
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get candidate by ID
export const getCandidateById = (req, res) => {
  try {
    const { id } = req.params;
    const candidates = loadCandidates();
    
    const candidate = candidates.find(c => c.id === parseInt(id));
    
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
      error: error.message
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
