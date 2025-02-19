import axios from 'axios';

// Configuração para utilizar o IP elástico com HTTPS
const api = axios.create({
    baseURL: 'https://3.217.55.187:8085/api', // Usando o IP elástico com HTTPS
});

export default api;
