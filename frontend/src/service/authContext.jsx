import React, { createContext, useContext, useState, useEffect } from 'react';
import API from './axios';

const AuthContext = createContext(null);


export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = currentUser != null;

  const login = async (accessToken, refreshToken) => {
    setIsLoading(true); // Установка перед началом запроса
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    try {
      const response = await API.get('get-user/');
      console.log(response)
      setCurrentUser(response.data[0]);
    } catch (error) {
      console.error('Error during login:', error);
      logout();
      window.location.href = '/login'; // Redirect to login page on login failure
    }
    setIsLoading(false); // Установка после завершения всех операций
  };


  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const updateUserData = async () => {
    try{
      const response = await API.get('get-user/');
      setCurrentUser(response.data[0]);
    }catch (error) {
      console.error('Error during user data update:', error);
      logout();
      window.location.href = '/login'; // Redirect to login page on update failure
    }
  }

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
    <AuthContext.Provider value={{ currentUser, isLoading, isLoggedIn, login, logout, updateUserData }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
