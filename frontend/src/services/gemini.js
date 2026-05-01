const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const initializeGemini = async () => {
  // Initialize Gemini AI
  if (!GEMINI_API_KEY) {
    // Gemini API key not configured
    return null;
  }
  return GEMINI_API_KEY;
};

export const geminiChat = async (message) => {
  try {
    const apiKey = await initializeGemini();
    if (!apiKey) throw new Error('Gemini API not initialized');

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('Gemini API Error');
    return response.json();
  } catch (error) {
    // Gemini API error
    throw error;
  }
};

export default { initializeGemini, geminiChat };
