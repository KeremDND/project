import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  preferences: Record<string, any>;
  is_admin: boolean;
}

interface Session {
  user: User;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { full_name?: string; phone?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, password: string, userData?: { full_name?: string; phone?: string }) => {
    try {
      setLoading(true);
      // Mock signup - just create a user object
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: userData
      };
      
      const mockProfile: UserProfile = {
        id: mockUser.id,
        email,
        full_name: userData?.full_name || null,
        phone: userData?.phone || null,
        address: null,
        preferences: {},
        is_admin: false
      };

      setUser(mockUser);
      setProfile(mockProfile);
      setSession({ user: mockUser });
      
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock signin - create a user if it doesn't exist
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        user_metadata: {}
      };
      
      const mockProfile: UserProfile = {
        id: mockUser.id,
        email,
        full_name: null,
        phone: null,
        address: null,
        preferences: {},
        is_admin: false
      };

      setUser(mockUser);
      setProfile(mockProfile);
      setSession({ user: mockUser });
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setUser(null);
      setProfile(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      if (profile) {
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
      }
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const refreshProfile = async () => {
    // Mock implementation - no action needed
    return Promise.resolve();
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}