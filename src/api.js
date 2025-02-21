import axios from 'axios';

// Configuração para utilizar o IP elástico com HTTP
const api = axios.create({
    baseURL: 'http://3.217.55.187:8085/api', // Usando o IP elástico com HTTP e porta 8085
});

export default api;
