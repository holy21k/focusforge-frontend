import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true); setError(null);
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem('token', data.access_token);
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (err) {
      setError(err.message || 'Login failed'); throw err;
    } finally { setLoading(false); }
  };

  const register = async (username, email, password) => {
    setLoading(true); setError(null);
    try {
      const data = await authApi.register({ username, email, password });
      localStorage.setItem('token', data.access_token);
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (err) {
      setError(err.message || 'Registration failed'); throw err;
    } finally { setLoading(false); }
  };

  const googleLogin = async (googleToken) => {
    setLoading(true); setError(null);
    try {
      const data = await authApi.googleLogin(googleToken);
      localStorage.setItem('token', data.access_token);
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (err) {
      setError(err.message || 'Google login failed'); throw err;
    } finally { setLoading(false); }
  };

  const updateUser = (fields) => setUser((prev) => ({ ...prev, ...fields }));
  const logout = () => { setUser(null); localStorage.removeItem('token'); };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);