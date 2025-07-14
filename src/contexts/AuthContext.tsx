import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  sendOTP: (data: {
    email?: string;
    phone?: string;
    name?: string;
    type: 'email' | 'phone';
  }) => Promise<{ success: boolean; message: string; messageId?: string }>;
  verifyOTP: (data: {
    email?: string;
    phone?: string;
    otp: string;
    type: 'email' | 'phone';
  }) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app start
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const response = await authService.verifyToken();
          if (response.success && response.data) {
            setUser(response.data.user);
          } else {
            // Token is invalid, clear it
            await authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (data: {
    email?: string;
    phone?: string;
    name?: string;
    type: 'email' | 'phone';
  }) => {
    try {
      const response = await authService.sendOTP(data);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      return { success: false, message };
    }
  };

  const verifyOTP = async (data: {
    email?: string;
    phone?: string;
    otp: string;
    type: 'email' | 'phone';
  }) => {
    try {
      const response = await authService.verifyOTP(data);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed';
      return { success: false, message };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    sendOTP,
    verifyOTP,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
