const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Get supported wastes
  async getSupportedWastes() {
    return this.request('/supported-wastes');
  }

  // Predict enzyme
  async predictEnzyme(wasteType, quantity) {
    return this.request('/predict-enzyme', {
      method: 'POST',
      body: JSON.stringify({
        waste_type: wasteType,
        quantity: quantity,
      }),
    });
  }

  // Predict decomposition
  async predictDecomposition(wasteType, quantity) {
    return this.request('/predict-decomposition', {
      method: 'POST',
      body: JSON.stringify({
        waste_type: wasteType,
        quantity: quantity,
      }),
    });
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getUserHistory() {
    return this.request('/user/history');
  }
}

export default new ApiClient();