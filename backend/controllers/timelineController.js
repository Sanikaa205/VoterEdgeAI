import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/timeline.json');

// Load timeline from JSON file
const loadTimeline = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { states: [] };
  }
};

// Sanitize and validate state parameter
const sanitizeState = (state) => {
  return String(state || '').trim().replace(/[<>]/g, '').substring(0, 100);
};

// Get timeline for all states
export const getTimelineAll = (req, res) => {
  try {
    const timelineData = loadTimeline();
    res.status(200).json({
      success: true,
      message: 'Timeline for all states retrieved successfully',
      data: timelineData.states
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get timeline by specific state
export const getTimelineByState = (req, res) => {
  try {
    const { state } = req.params;
    
    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    const sanitizedState = sanitizeState(state);
    const timelineData = loadTimeline();

    if (!Array.isArray(timelineData.states)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid data format'
      });
    }

    const stateTimeline = timelineData.states.find(
      s => s.state && s.state.toLowerCase() === sanitizedState.toLowerCase()
    );

    if (!stateTimeline) {
      return res.status(404).json({
        success: false,
        error: `No timeline found for state: ${sanitizedState}`
      });
    }

    res.status(200).json({
      success: true,
      message: `Timeline for ${sanitizedState} retrieved successfully`,
      data: stateTimeline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve timeline'
    });
  }
}
