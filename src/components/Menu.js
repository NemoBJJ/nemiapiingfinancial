import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Database, Settings } from 'lucide-react';
import './Menu.css';

const Menu = () => {
  return (
    <div className="financeiro-home">
      <div className="financeiro-hero">
        <span className="financeiro-badge">GesteX</span>
        <h1>FINANCEIRO</h1>
        <p>
  
        </p>
      </div>

      <div className="financeiro-cards">
        {/* Dashboard */}
        <Link to="/dashboard" className="financeiro-card dashboard-card">
          <div className="card-icon">
            <TrendingUp size={48} strokeWidth={2} />
          </div>
          <h2>Dashboard</h2>
          <p>
           
          </p>
          <span>Acessar →</span>
        </Link>

        {/* Banco de Dados */}
        <Link to="/database" className="financeiro-card banco-card">
          <div className="card-icon">
            <Database size={48} strokeWidth={2} />
          </div>
          <h2>Banco de Dados</h2>
          <p>
            
          </p>
          <span>Acessar →</span>
        </Link>

        {/* Gerenciar */}
        <Link
          to="/crud-transactions"
          className="financeiro-card gerenciar-card"
        >
          <div className="card-icon">
            <Settings size={48} strokeWidth={2} />
          </div>
          <h2>Gerenciar</h2>
          <p>
         
          </p>
          <span>Acessar →</span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;