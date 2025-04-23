'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, logoutUser, registerUser } from '@/lib/api-client';
import { UserTokenResponseDto } from '@/types/interfaces';

interface AuthContextType {
  user: UserTokenResponseDto | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getUsernameFromAuth: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set a cookie
const setCookie = (name: string, value: string, days = 7) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  document.cookie = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};

// Helper function to remove a cookie
const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserTokenResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userId = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('user_role');
        const expiresAt = localStorage.getItem('expires_at');

        if (token && userId) {
          setUser({
            token,
            userId,
            username: username || '',
            role: role || 'USER',
            expiresAt: expiresAt || ''
          });
          
          // Ensure cookie is set as well during initialization
          setCookie('auth_token', token);
        }
      } catch (error) {
        console.error('Failed to initialize auth', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginUser({
        username,
        password
      });

      if (response.success && response.data) {
        // Store user data in state
        setUser(response.data);
        
        // Set auth_token cookie for middleware to detect
        setCookie('auth_token', response.data.token);
        
        console.log('Auth token cookie set:', response.data.token);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.message || 'Authentication failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await registerUser({
        username,
        password
      });

      if (response.success && response.data) {
        // Store user data in state
        setUser(response.data);
        
        // Set auth_token cookie for middleware to detect
        setCookie('auth_token', response.data.token);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage data
    logoutUser();
    
    // Clear auth cookie
    removeCookie('auth_token');
    
    // Reset user state
    setUser(null);

    // redirect to login page
    window.location.href = '/login';
  };

  const getUsernameFromAuth = () => {
    // First try from user state
    if (user?.username) {
      return user.username;
    }
    
    // Then try from localStorage as fallback
    return localStorage.getItem('username');
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isInitialized,
        login,
        register,
        logout,
        getUsernameFromAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};