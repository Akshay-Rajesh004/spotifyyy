import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  product: string;
  is_premium: boolean;
  images: any[];
  followers: number;
}

interface SpotifyAuthContextType {
  accessToken: string | null;
  user: SpotifyUser | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextType | undefined>(undefined);

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return context;
};

interface SpotifyAuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const SpotifyAuthProvider: React.FC<SpotifyAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check for auth callback
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        await handleAuthCallback(code);
        // Clean up URL
        window.history.replaceState({}, document.title, '/');
        return;
      }

      // Check for stored token
      const storedToken = localStorage.getItem('spotify_access_token');
      if (storedToken) {
        setAccessToken(storedToken);
        await fetchUserProfile(storedToken);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthCallback = async (code: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/callback?code=${code}`);
      const { access_token, refresh_token } = response.data;
      
      setAccessToken(access_token);
      localStorage.setItem('spotify_access_token', access_token);
      localStorage.setItem('spotify_refresh_token', refresh_token);
      
      await fetchUserProfile(access_token);
    } catch (error) {
      console.error('Auth callback error:', error);
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Token might be expired, try to refresh
      const refreshSuccess = await refreshToken();
      if (!refreshSuccess) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/login`);
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
  };

  const refreshToken = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token');
    if (!storedRefreshToken) return false;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
        refresh_token: storedRefreshToken
      });
      
      const { access_token } = response.data;
      setAccessToken(access_token);
      localStorage.setItem('spotify_access_token', access_token);
      
      await fetchUserProfile(access_token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const value: SpotifyAuthContextType = {
    accessToken,
    user,
    isAuthenticated: !!accessToken && !!user,
    isPremium: user?.is_premium || false,
    isLoading,
    login,
    logout,
    refreshToken
  };

  return (
    <SpotifyAuthContext.Provider value={value}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};