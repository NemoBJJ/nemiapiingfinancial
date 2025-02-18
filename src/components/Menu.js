import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
    return (
        <div className="menu-container">
            <h1 className="menu-title">Financial Control System</h1> {/* Título em inglês */}
            <div className="menu-grid">
                <Link to="/transactions" className="menu-item">
                    <div className="menu-icon">💰</div>
                    <span>Transactions</span> {/* Alterado para inglês */}
                </Link>
                <Link to="/statistics" className="menu-item">
                    <div className="menu-icon">📊</div>
                    <span>Statistics</span> {/* Alterado para inglês */}
                </Link>
                <Link to="/dashboard" className="menu-item">
                    <div className="menu-icon">📈</div>
                    <span>Dashboard</span> {/* Alterado para inglês */}
                </Link>
                <Link to="/database" className="menu-item">
                    <div className="menu-icon">🗄️</div>
                    <span>Database</span> {/* Alterado para inglês */}
                </Link>
                <Link to="/crud-transactions" className="menu-item">
                    <div className="menu-icon">⚙️</div>
                    <span>Manage Transactions</span> {/* Alterado para inglês */}
                </Link>
            </div>
        </div>
    );
};

export default Menu;
