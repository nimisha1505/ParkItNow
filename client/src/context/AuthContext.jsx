import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosClient.get('/auth/current-user');
      setUser(response.data.data);
    } catch (error) {
      console.log('No current user logged in');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const loginUser = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    setUser(response.data.data.user);
    return response.data;
  };

  const registerUser = async (name, email, password) => {
    const response = await axiosClient.post('/auth/register', { name, email, password });
    return response.data;
  };

  const logoutUser = async () => {
    await axiosClient.post('/auth/logout');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
