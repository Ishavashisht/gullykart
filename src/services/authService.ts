import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface OTPResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

export const authService = {
  // Login with email/username and password
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Register new user
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get user profile
  getProfile: async (): Promise<{ success: boolean; data?: { user: User } }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Verify token
  verifyToken: async (): Promise<{ success: boolean; data?: { user: User } }> => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Send OTP (email or phone)
  sendOTP: async (data: {
    email?: string;
    phone?: string;
    name?: string;
    type: 'email' | 'phone';
  }): Promise<OTPResponse> => {
    const response = await api.post('/send-otp', data);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (data: {
    email?: string;
    phone?: string;
    otp: string;
    type: 'email' | 'phone';
  }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/verify-otp', data);
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
