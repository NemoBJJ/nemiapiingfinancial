import React from 'react';
import ReactDOM from 'react-dom/client'; // Note a mudança aqui
import './index.css';
import App from './App'; // Certifique-se de que o componente App está correto

// Atualize para React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
