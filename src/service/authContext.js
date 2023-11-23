import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../service/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = currentUser !== null;

  const login = async (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const response = await API.get('get-user/');
    setCurrentUser(response.data[0]);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await API.get('get-user/');
        setCurrentUser(response.data[0]);
      } catch (error) {
        console.error('Error during initial auth check:', error);
        logout(); 
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, isLoggedIn, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
