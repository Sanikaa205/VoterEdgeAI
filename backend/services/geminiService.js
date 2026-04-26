import { GoogleGenerativeAI } from '@google/generative-ai';

const FALLBACK_MESSAGE = "I'm sorry, I couldn't process your request right now. Please try again in a moment, or visit eci.gov.in for official election information.";

const SYSTEM_PROMPT = `You are VoterEdge Assistant, a neutral civic education AI for Indian elections.

You must:
- Explain the voting process, eligibility criteria, required documents, and voter rights clearly
- Help users understand registration steps, polling booth procedures, and EVM usage
- Provide factual, step-by-step guidance when asked about voter ID creation or registration
- NEVER show political bias or favoritism toward any party or candidate
- NEVER recommend, endorse, or oppose any candidate or political party
- Keep answers simple, clear, and concise (2-4 sentences unless step-by-step instructions are needed)
- Use bullet points or numbered lists for multi-step instructions
- If unsure about any information, suggest visiting eci.gov.in or calling helpline 1950
- Always maintain a helpful, respectful, and encouraging tone
- Support questions in English, Hindi, and Marathi`;

const detectLanguage = (text = '') => {
  const input = String(text).trim();
  if (!input) return 'English';

  const hasDevanagari = /[\u0900-\u097F]/.test(input);
  if (!hasDevanagari) return 'English';

  const marathiMarkers = ['आहे', 'काय', 'तुम्ही', 'मध्ये', 'नाही', 'कृपया', 'माहिती'];
  const hindiMarkers = ['है', 'क्या', 'आप', 'में', 'नहीं', 'कृपया', 'मतदाता'];

  const marathiHits = marathiMarkers.filter((word) => input.includes(word)).length;
  const hindiHits = hindiMarkers.filter((word) => input.includes(word)).length;

  return marathiHits > hindiHits ? 'Marathi' : 'Hindi';
};

const formatResponse = (text = '') =>
  String(text)
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const normalizeHistory = (history) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item) => item && typeof item.text === 'string' && item.text.trim())
    .map((item) => ({
      role: item.sender === 'user' ? 'user' : 'model',
      parts: [{ text: item.text.trim() }]
    }));
};

export const askGemini = async (message, history = []) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return FALLBACK_MESSAGE;
    }

    if (typeof message !== 'string' || !message.trim()) {
      return 'Please enter a valid question about elections or voting.';
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am VoterEdge Assistant. I will provide neutral, factual civic education about Indian elections. I will never show political bias or recommend any candidate. I will keep my answers clear and helpful.' }] },
        ...normalizeHistory(history).slice(-10)
      ]
    });

    const detectedLanguage = detectLanguage(message);
    const result = await chat.sendMessage(
      `Respond in ${detectedLanguage}. Keep formatting clean and readable.\n\n${message.trim()}`
    );
    const response = await result.response;
    const reply = typeof response.text === 'function' ? response.text() : '';
    const formattedReply = formatResponse(reply || '');

    return formattedReply || FALLBACK_MESSAGE;
  } catch (error) {
    console.error('Gemini service error:', error?.message || error);
    if (error?.message?.includes('API key')) {
      return 'The AI service is not configured properly. Please check the API key configuration.';
    }
    if (error?.message?.includes('quota') || error?.message?.includes('rate')) {
      return 'The AI service is temporarily busy. Please try again in a moment.';
    }
    return FALLBACK_MESSAGE;
  }
};
