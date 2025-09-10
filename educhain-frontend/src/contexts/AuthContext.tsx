import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { frontendAuthService } from '../services/api';
import XPService from '../services/xpService';

interface User {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  totalXP: number;
  currentLevel: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (walletAddress: string, username?: string, email?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: { username?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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
    // Check if user has a stored wallet connection
    const storedWallet = localStorage.getItem('connected_wallet');
    if (storedWallet) {
      loadUserProfile(storedWallet);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async (walletAddress: string) => {
    try {
      const profile = frontendAuthService.getProfile(walletAddress);
      if (profile) {
        // Load current XP data
        const xpData = XPService.getUserXP(walletAddress);
        const user: User = {
          id: profile.id,
          walletAddress: profile.walletAddress,
          username: profile.username,
          email: profile.email,
          totalXP: xpData.totalXP,
          currentLevel: xpData.currentLevel,
        };
        setUser(user);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('connected_wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (walletAddress: string, username?: string, email?: string) => {
    try {
      setIsLoading(true);
      const profile = frontendAuthService.login(walletAddress, username, email);

      // Load XP data
      const xpData = XPService.getUserXP(walletAddress);

      const user: User = {
        id: profile.id,
        walletAddress: profile.walletAddress,
        username: profile.username,
        email: profile.email,
        totalXP: xpData.totalXP,
        currentLevel: xpData.currentLevel,
      };

      setUser(user);
      localStorage.setItem('connected_wallet', walletAddress);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      frontendAuthService.logout(user.walletAddress);
      localStorage.removeItem('connected_wallet');
    }
    setUser(null);
  };

  const updateProfile = async (updates: { username?: string; email?: string }) => {
    try {
      if (!user) throw new Error('No user logged in');

      const updatedProfile = frontendAuthService.updateProfile(user.walletAddress, updates);

      // Load updated XP data
      const xpData = XPService.getUserXP(user.walletAddress);

      const updatedUser: User = {
        ...user,
        username: updatedProfile.username,
        email: updatedProfile.email,
        totalXP: xpData.totalXP,
        currentLevel: xpData.currentLevel,
      };

      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};