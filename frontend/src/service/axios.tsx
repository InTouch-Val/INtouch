//@ts-nocheck
import axios from "axios";

const API = axios.create({
  baseURL: "https://app.intouch.care/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedRequestsQueue = [];
};

function checkTokenExpiration(accessToken) {
  try {
    const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      return !(decodedToken.exp < currentTime);
    }
    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
}

async function refreshTokens() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  // Проверяем, истек ли срок действия текущего токена
  const accessToken = localStorage.getItem("accessToken");
  if (checkTokenExpiration(accessToken)) {
    return accessToken;
  } else {
    try {
      const response = await API.post("token/refresh/", {
        refresh: refreshToken,
      });
      const { access: newAccessToken, refresh: newRefreshToken } =
        response.data;
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.clear();
      window.location.href = "/login"; // Redirect to login page on refresh failure
      throw error;
    }
  }
}

API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && checkTokenExpiration(accessToken)) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    throw error;
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.data.code === "token_not_valid") {
      return (window.location.href = "/login");
    }
    console.error("Response error:", error);
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");
    if (error.response.status === 401) {
      debugger;
      try {
        const token = await refreshTokens();
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw error;
      }
    }

    throw error;
  }
);

export { API };
