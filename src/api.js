import axios from 'axios';

// Configuração para utilizar o IP elástico com HTTP
const api = axios.create({
    baseURL: 'http://3.217.55.187:80/api', // Porta 80
});

export default api;
