import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi, loginApi, registerApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('apexfit_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [justRegistered, setJustRegistered] = useState(() => {
    return localStorage.getItem('apexfit_justRegistered') === 'true';
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('apexfit_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMeApi();
        setUser(data);
        localStorage.setItem('apexfit_user', JSON.stringify(data));
      } catch (err) {
        console.error('Session restore failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem('apexfit_token', data.token);
    localStorage.setItem('apexfit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await registerApi(userData);
    localStorage.setItem('apexfit_token', data.token);
    localStorage.setItem('apexfit_user', JSON.stringify(data));
    setUser(data);
    setJustRegistered(true);
    localStorage.setItem('apexfit_justRegistered', 'true');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('apexfit_token');
    localStorage.removeItem('apexfit_user');
    setUser(null);
  };

  const reloadUser = async () => {
    try {
      const { data } = await getMeApi();
      setUser(data);
      localStorage.setItem('apexfit_user', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const clearJustRegistered = () => {
    setJustRegistered(false);
    localStorage.removeItem('apexfit_justRegistered');
  };

  return (
    <AuthContext.Provider value={{ user, loading, justRegistered, clearJustRegistered, login, register, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
