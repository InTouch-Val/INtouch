import React, { createContext, useContext, useState, useEffect } from "react";
import { API } from "./axios";
import { ClientAssignmentCard } from "../utils/global-types";

export interface User {
  user_type: string;
  first_name: string;
  last_name: string;
  photo: string;
  id: number;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  updateUserData: () => Promise<void>;
  card: ClientAssignmentCard | null;
  setCurrentCard: (card: ClientAssignmentCard) => void;
  initAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error occured");
  }
  return context;
};

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [card, setCard] = useState<ClientAssignmentCard | null>(null);

  const isLoggedIn = currentUser != null;

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    window.location.href = "/login";
  };

  const login = async (accessToken, refreshToken) => {
    setIsLoading(true); // Установка перед началом запроса
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    try {
      const response = await API.get("get-user/");
      console.log(response);
      setCurrentUser(response.data[0]);
      console.log(currentUser);
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response.status === 401) {
        logout();
      }
    }
    setIsLoading(false); // Установка после завершения всех операций
  };

  // useEffect(() => {
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   const accessToken = localStorage.getItem("accessToken");

  //   try {
  //     const request = API.post("/token/refresh/", { refresh: refreshToken });
  //     if (request.status == 200) {
  //       localStorage.setItem("accessToken", request.data.access);
  //       localStorage.setItem("refreshToken", request.data.refresh);
  //     }

  //     if (request.status >= 401) {
  //      window.location.href = "/login";
  //     }

  //     return request;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, []);

  const updateUserData = async () => {
    try {
      const response = await API.get("get-user/");
      setCurrentUser(response.data[0]);
    } catch (error) {
      console.error("Error during user data update:", error);
      if (error.response.status === 401) {
        logout();
        window.location.href = "/login"; // Redirect to login page on update failure
      }
    }
  };

  function setCurrentCard(card: ClientAssignmentCard) {
    setCard(card);
  }

  const initAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.get("get-user/");
      setCurrentUser(response.data[0]);
    } catch (error) {
      console.error("Error during initial auth check:", error);
      logout();
    }
    setIsLoading(false);
  };

  useEffect(() => {
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
        initAuth,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
