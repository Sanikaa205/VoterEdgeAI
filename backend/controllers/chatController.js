import { askGemini } from '../services/geminiService.js';

// Send message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { message, history } = req.body;
    const reply = await askGemini(message, history);

    res.status(200).json({
      success: true,
      message: 'Message processed successfully',
      data: {
        reply: reply,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process message'
    });
  }
};
