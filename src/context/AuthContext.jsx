import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('packiq_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (role, username, password) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 1200)); // simulate network
    if (!username || !password) {
      setError('Please enter your credentials.');
      setLoading(false);
      return false;
    }
    if (password.length < 4) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
      return false;
    }
    const userData = MOCK_USER[role] || MOCK_USER.inspector;
    localStorage.setItem('packiq_user', JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('packiq_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
