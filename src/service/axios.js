import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Функция для обновления токенов
async function refreshTokens() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await axios.post('http://127.0.0.1:8000/api/v1/token/refresh/', { refresh: refreshToken });
    console.log(response);
    const { access: newAccessToken, refresh: newRefreshToken } = response.data;
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error updating tokens:', error);
    // Обработка ошибки (например, перенаправление на страницу входа)
  }
}

// Интерсептор запросов
API.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Интерсептор ответов
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshTokens();
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return API(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default API;
