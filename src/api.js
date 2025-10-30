import axios from 'axios';

// Configuração CORRETA com /api/api pela lógica do container
const api = axios.create({
  baseURL: 'https://financial-container.neemindev.com/api/api',
});

export default api;