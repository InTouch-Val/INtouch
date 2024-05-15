//@ts-nocheck
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://app.intouch.care/api/v1/',
  headers: {
    'Content-Type': 'application/json',
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

async function refreshTokens() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  try {
    const response = await API.post('token/refresh/', { refresh: refreshToken });
    const { access: newAccessToken, refresh: newRefreshToken } = response.data;
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);

    localStorage.clear();
    window.location.href = '/login'; // Redirect to login page on refresh failure
    throw error; //Передаём ошибку дальше для обработки в интерцепторе ответов
  }
}

API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // return Promise.reject(error);
    throw error;
  },
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest._retry) {
      try {
        const token = await refreshTokens();
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw refreshError;
      }
    }

    throw error;
  },
);

export { API };
