import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:9090';

// Базовая конфигурация для запросов
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;