import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  return (
    <div className="financeiro-home">
      <div className="financeiro-hero">
        <span className="financeiro-badge">GesteX</span>
        <h1>FINANCEIRO</h1>
        <p>
          Controle financeiro, dashboards e gestão de transações.
        </p>
      </div>

      <div className="financeiro-cards">
        {/* Dashboard */}
        <Link to="/dashboard" className="financeiro-card dashboard-card">
          <div className="card-icon">📈</div>
          <h2>Dashboard</h2>
          <p>
            Visualização gráfica de receitas, despesas e indicadores.
          </p>
          <span>Acessar →</span>
        </Link>

        {/* Banco de Dados */}
        <Link to="/database" className="financeiro-card banco-card">
          <div className="card-icon">🗄️</div>
          <h2>Banco de Dados</h2>
          <p>
            Consulta completa das transações armazenadas (paginação).
          </p>
          <span>Acessar →</span>
        </Link>

        {/* Gerenciar */}
        <Link
          to="/crud-transactions"
          className="financeiro-card gerenciar-card"
        >
          <div className="card-icon">⚙️</div>
          <h2>Gerenciar</h2>
          <p>
            Criar, editar, excluir e consultar transações individualmente.
          </p>
          <span>Acessar →</span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;