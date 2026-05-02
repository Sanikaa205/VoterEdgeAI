const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Validates API response structure
 */
const validateResponse = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format');
  }
  return data;
};

/**
 * API Client with built-in error handling and validation
 */
export const apiClient = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      const data = await response.json();
      return validateResponse(data);
    } catch (error) {
      throw new Error(`API GET Error: ${error.message}`);
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      const responseData = await response.json();
      return validateResponse(responseData);
    } catch (error) {
      throw new Error(`API POST Error: ${error.message}`);
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      const responseData = await response.json();
      return validateResponse(responseData);
    } catch (error) {
      throw new Error(`API PUT Error: ${error.message}`);
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      const data = await response.json();
      return validateResponse(data);
    } catch (error) {
      throw new Error(`API DELETE Error: ${error.message}`);
    }
  },
};

export default apiClient;
