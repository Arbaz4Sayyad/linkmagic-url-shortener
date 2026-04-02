import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if necessary, or let the app handle it via state
    }
    const message = error.response?.data?.message || error.message;
    console.error('API Response Error:', message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username, password) => api.post('/auth/signin', { username, password }),
  register: (username, email, password) => api.post('/auth/signup', { username, email, password }),
};

export const urlService = {
  createShortUrl: async (originalUrl, expiryDate = null, customSlug = null) => {
    const response = await api.post('/shorten', { originalUrl, expiryDate, customSlug });
    return response.data;
  },

  bulkShortenUrls: async (urls) => {
    const response = await api.post('/shorten/bulk', { requests: urls });
    return response.data;
  },

  getUserUrls: async () => {
    const response = await api.get('/urls');
    return response.data;
  },

  getUrlStats: async (shortCode) => {
    const response = await api.get(`/info/${shortCode}`);
    return response.data;
  },
};

export const apiKeyService = {
  getAllApiKeys: async () => {
    const response = await api.get('/users/apikeys');
    return response.data;
  },

  generateApiKey: async (name) => {
    const response = await api.post('/users/apikeys', { name });
    return response.data;
  },

  revokeApiKey: async (keyId) => {
    const response = await api.delete(`/users/apikeys/${keyId}`);
    return response.data;
  },
};

export default api;
