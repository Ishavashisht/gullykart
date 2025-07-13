import { useState } from 'react';
import { toast } from 'sonner';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);

  // Simulate Google OAuth process (for demo)
  const signInWithGoogle = async (): Promise<GoogleUser | null> => {
    setIsLoading(true);
    
    try {
      // Simulate OAuth process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful Google login
      const mockGoogleUser: GoogleUser = {
        id: '1234567890',
        email: 'user@gmail.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150',
        verified_email: true,
      };
      
      setUser(mockGoogleUser);
      toast.success(`Welcome, ${mockGoogleUser.name}!`);
      
      return mockGoogleUser;
    } catch (error) {
      console.error('Google Auth Error:', error);
      toast.error('Google authentication failed. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    toast.success('Signed out successfully');
  };

  return {
    user,
    isLoading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };
};
