import { createContext, useContext, useState, useEffect } from 'react';
import { API } from './axios';

const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [card, setCard] = useState(null);

  console.log(card);

  const isLoggedIn = currentUser != null;

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const login = async (accessToken, refreshToken) => {
    setIsLoading(true); // Установка перед началом запроса
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    try {
      const response = await API.get('get-user/');
      console.log(response);
      setCurrentUser(response.data[0]);
      console.log(currentUser);
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response.status === 401) {
        logout();
      }
    }
    setIsLoading(false); // Установка после завершения всех операций
  };

  const updateUserData = async () => {
    try {
      const response = await API.get('get-user/');
      setCurrentUser(response.data[0]);
    } catch (error) {
      console.error('Error during user data update:', error);
      if (error.response.status === 401) {
        logout();
        window.location.href = '/login'; // Redirect to login page on update failure
      }
    }
  };

  function setCurrentCard(card) {
    setCard(card);
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
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isLoggedIn,
        login,
        logout,
        updateUserData,
        card,
        setCurrentCard,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
