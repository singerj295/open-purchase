"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  restaurantName: string;
  restaurantAddress: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUser: User = {
  id: "1",
  name: "Restaurant Owner",
  email: "demo@restaurant.com",
  restaurantName: "My Restaurant",
  restaurantAddress: "123 Food Street, Hong Kong",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('open-purchase-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(defaultUser);
        localStorage.setItem('open-purchase-user', JSON.stringify(defaultUser));
      }
    } else {
      // Auto-login with demo user for now
      setUser(defaultUser);
      localStorage.setItem('open-purchase-user', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user: User = {
      id: "1",
      name: "Restaurant Owner",
      email,
      restaurantName: "My Restaurant",
      restaurantAddress: "123 Food Street, Hong Kong",
    };
    
    setUser(user);
    localStorage.setItem('open-purchase-user', JSON.stringify(user));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('open-purchase-user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('open-purchase-user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
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
