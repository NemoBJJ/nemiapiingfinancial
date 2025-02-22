import axios from 'axios';

// Configuração para utilizar o IP elástico com HTTP
const api = axios.create({
  baseURL: 'https://api1.neemindev.com/api',
});


export default api;
