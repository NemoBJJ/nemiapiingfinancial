import axios from 'axios';

// Configuração para utilizar o IP elástico
const api = axios.create({
    baseURL: 'http://3.217.55.187:8085/api', // Usando IP elástico e a porta 8085
});

export default api;
