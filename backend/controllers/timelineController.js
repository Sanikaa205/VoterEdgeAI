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
    console.error('Error loading timeline:', error);
    return { states: [] };
  }
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
    const timelineData = loadTimeline();
    
    const stateTimeline = timelineData.states.find(
      s => s.state.toLowerCase() === state.toLowerCase()
    );
    
    if (!stateTimeline) {
      return res.status(404).json({
        success: false,
        error: `No timeline found for state: ${state}`
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Timeline for ${state} retrieved successfully`,
      data: stateTimeline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
