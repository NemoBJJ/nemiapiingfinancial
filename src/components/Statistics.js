import React, { useEffect, useState } from 'react';
import api from '../api';
import './Statistics.css';

const Statistics = () => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await api.get('/dashboard/statistics');
                setStatistics(response.data);
            } catch (error) {
                console.error('Erro ao buscar estatísticas:', error);
            }
        };
        fetchStatistics();
    }, []);

    if (!statistics) {
        return <p>Loading statistics...</p>;
    }

    return (
        <div className="statistics-container">
            <h2>Financial Statistics</h2>
            <div className="statistics-grid">
                <div className="stat-item receita">
                    <h3>Total Revenues</h3>
                    <p>{statistics.totalReceitas ? `R$ ${statistics.totalReceitas.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Total Expenses</h3>
                    <p>{statistics.totalDespesas ? `R$ ${statistics.totalDespesas.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>

                <div className="stat-item receita">
                    <h3>Monthly Average of Revenues</h3>
                    <p>{statistics.mediaReceitasMensal ? `R$ ${statistics.mediaReceitasMensal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Monthly Average of Expenses</h3>
                    <p>{statistics.mediaDespesasMensal ? `R$ ${statistics.mediaDespesasMensal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>

                <div className="stat-item receita">
                    <h3>Median of Revenues</h3>
                    <p>{statistics.medianaReceitas ? `R$ ${statistics.medianaReceitas.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Median of Expenses</h3>
                    <p>{statistics.medianaDespesas ? `R$ ${statistics.medianaDespesas.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>

                <div className="stat-item receita">
                    <h3>Mode of Revenues</h3>
                    <p>{statistics.modaReceitas ? `R$ ${statistics.modaReceitas.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Mode of Expenses</h3>
                    <p>{statistics.modaDespesas ? `R$ ${statistics.modaDespesas.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>

                <div className="stat-item receita">
                    <h3>Standard Deviation of Revenues</h3>
                    <p>{statistics.desvioPadraoReceitas ? `R$ ${statistics.desvioPadraoReceitas.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Standard Deviation of Expenses</h3>
                    <p>{statistics.desvioPadraoDespesas ? `R$ ${statistics.desvioPadraoDespesas.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>
            </div>

            <div className="back-to-menu">
                <a href="/">
                    <button className="back-button">Back to Menu</button>
                </a>
            </div>
        </div>
    );
};

export default Statistics;