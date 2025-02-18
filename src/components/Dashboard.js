import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Charts from './Charts'; // Componente de gráficos

const Dashboard = () => {
    useEffect(() => {
        api.get('/dashboard')
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
            });
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {/* Botão para voltar ao menu */}
            <div style={{ marginBottom: '20px' }}>
                <Link to="/">
                    <button style={{ padding: '10px 20px', fontSize: '16px' }}>
                        Back to Menu
                    </button>
                </Link>
            </div>
            <h1>Financial Dashboard</h1>
            {/* Gráfico */}
            <Charts />
        </div>
    );
};

export default Dashboard;
