import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalReceitas: 0,
        totalDespesas: 0,
        saldo: 0,
        totalTransacoes: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/transactions');
                const data = response.data;
                console.log('Transações carregadas:', data);
                setTransactions(data);

                // Calcular totais
                const receitas = data
                    .filter(t => t.type === 'REVENUE')
                    .reduce((acc, t) => acc + (t.amount || 0), 0);
                
                const despesas = data
                    .filter(t => t.type === 'EXPENSE')
                    .reduce((acc, t) => acc + (t.amount || 0), 0);

                console.log('Receitas:', receitas);
                console.log('Despesas:', despesas);

                setStats({
                    totalReceitas: receitas,
                    totalDespesas: despesas,
                    saldo: receitas - despesas,
                    totalTransacoes: data.length,
                });
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Processar dados para o gráfico mensal - USANDO transactionMonth
    const processMonthlyData = () => {
        const monthOrder = {
            'Janeiro': 1, 'Fevereiro': 2, 'Março': 3, 'Maro': 3,
            'Abril': 4, 'Maio': 5, 'Junho': 6, 'Julho': 7,
            'Agosto': 8, 'Setembro': 9, 'Outubro': 10, 'Novembro': 11, 'Dezembro': 12
        };

        const monthlyMap = new Map();

        transactions.forEach(t => {
            let month = t.transactionMonth;
            if (!month) return;
            
            // Corrigir "Maro" para "Março"
            if (month === 'Maro') month = 'Março';
            
            const amount = t.amount || 0;

            if (!monthlyMap.has(month)) {
                monthlyMap.set(month, { receitas: 0, despesas: 0 });
            }

            const current = monthlyMap.get(month);
            if (t.type === 'REVENUE') {
                current.receitas += amount;
            } else if (t.type === 'EXPENSE') {
                current.despesas += amount;
            }
        });

        // Ordenar meses
        const sortedMonths = Array.from(monthlyMap.keys()).sort((a, b) => 
            (monthOrder[a] || 99) - (monthOrder[b] || 99)
        );

        const receitasData = sortedMonths.map(m => monthlyMap.get(m).receitas);
        const despesasData = sortedMonths.map(m => monthlyMap.get(m).despesas);

        console.log('Meses:', sortedMonths);
        console.log('Receitas por mês:', receitasData);
        console.log('Despesas por mês:', despesasData);

        return { labels: sortedMonths, receitasData, despesasData };
    };

    const donutData = {
        labels: ['Receitas', 'Despesas'],
        datasets: [
            {
                data: [stats.totalReceitas, stats.totalDespesas],
                backgroundColor: ['#22c55e', '#ef4444'],
                borderColor: ['#166534', '#7f1d1d'],
                borderWidth: 2,
            },
        ],
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#f8fafc', font: { size: 12 } },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const total = stats.totalReceitas + stats.totalDespesas;
                        const value = context.raw || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${context.label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${percentage}%)`;
                    },
                },
            },
        },
    };

    const monthlyData = processMonthlyData();
    
    const barChartData = {
        labels: monthlyData.labels,
        datasets: [
            {
                label: 'Receitas',
                data: monthlyData.receitasData,
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: '#22c55e',
                borderWidth: 1,
                borderRadius: 8,
            },
            {
                label: 'Despesas',
                data: monthlyData.despesasData,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: '#ef4444',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#cbd5e1', font: { size: 12 } },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw || 0;
                        return `${context.dataset.label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8', font: { size: 11 } },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
            },
            y: {
                ticks: {
                    color: '#94a3b8',
                    callback: (value) => `R$ ${value.toLocaleString('pt-BR')}`,
                },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
                beginAtZero: true,
            },
        },
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <p>Carregando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <Link to="/">
                    <button className="back-button-dashboard">← Voltar ao Menu</button>
                </Link>
                <h1>Financeiro</h1>
            </div>

            {/* Cards de métricas */}
            <div className="metrics-grid">
                <div className="metric-card revenue-card">
                    <div className="metric-icon">💰</div>
                    <div className="metric-info">
                        <span className="metric-label">Total Receitas</span>
                        <span className="metric-value">{formatCurrency(stats.totalReceitas)}</span>
                    </div>
                </div>

                <div className="metric-card expense-card">
                    <div className="metric-icon">💸</div>
                    <div className="metric-info">
                        <span className="metric-label">Total Despesas</span>
                        <span className="metric-value">{formatCurrency(stats.totalDespesas)}</span>
                    </div>
                </div>

                <div className={`metric-card balance-card ${stats.saldo >= 0 ? 'positive' : 'negative'}`}>
                    <div className="metric-icon">⚖️</div>
                    <div className="metric-info">
                        <span className="metric-label">Saldo Total</span>
                        <span className="metric-value">{formatCurrency(stats.saldo)}</span>
                    </div>
                </div>

                <div className="metric-card transactions-card">
                    <div className="metric-icon">📊</div>
                    <div className="metric-info">
                        <span className="metric-label">Total Transações</span>
                        <span className="metric-value">{stats.totalTransacoes}</span>
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="charts-row">
                <div className="chart-card bar-chart">
                    <h3>📈 Evolução Mensal</h3>
                    <div className="chart-wrapper">
                        {monthlyData.labels.length > 0 ? (
                            <Bar data={barChartData} options={barOptions} />
                        ) : (
                            <div className="no-data-message">Sem dados para exibir</div>
                        )}
                    </div>
                </div>

                <div className="chart-card donut-chart">
                    <h3>🥧 Proporção Receitas x Despesas</h3>
                    <div className="donut-wrapper">
                        {(stats.totalReceitas > 0 || stats.totalDespesas > 0) ? (
                            <Doughnut data={donutData} options={donutOptions} />
                        ) : (
                            <div className="no-data-message">Sem dados para exibir</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabela de últimas transações */}
            <div className="recent-transactions">
                <h3>📋 Últimas Transações</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Descrição</th>
                                <th>Categoria</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice().reverse().slice(0, 10).map((t) => (
                                <tr key={t.id}>
                                    <td>{t.date ? new Date(t.date).toLocaleDateString('pt-BR') : '-'}</td>
                                    <td>{t.description || '-'}</td>
                                    <td>{t.transactionCategory || '-'}</td>
                                    <td>
                                        <span className={`type-badge ${t.type === 'REVENUE' ? 'badge-receita' : 'badge-despesa'}`}>
                                            {t.type === 'REVENUE' ? 'Receita' : 'Despesa'}
                                        </span>
                                    </td>
                                    <td className={t.type === 'REVENUE' ? 'value-receita' : 'value-despesa'}>
                                        {formatCurrency(t.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx="true">{`
                .dashboard-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    padding: 2rem;
                }
                .dashboard-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .dashboard-header h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
                .back-button-dashboard {
                    padding: 0.5rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #f8fafc;
                    background: rgba(100, 116, 139, 0.3);
                    border: 1px solid rgba(255, 193, 7, 0.5);
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .back-button-dashboard:hover {
                    background: rgba(255, 193, 7, 0.2);
                    border-color: #fbbf24;
                    transform: translateX(-4px);
                }
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .metric-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                    transition: transform 0.2s ease, border-color 0.2s ease;
                }
                .metric-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(255, 193, 7, 0.5);
                }
                .metric-icon { font-size: 2.5rem; }
                .metric-info { display: flex; flex-direction: column; }
                .metric-label { font-size: 0.875rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
                .metric-value { font-size: 1.75rem; font-weight: bold; color: #f8fafc; }
                .revenue-card .metric-value { color: #22c55e; }
                .expense-card .metric-value { color: #ef4444; }
                .balance-card.positive .metric-value { color: #22c55e; }
                .balance-card.negative .metric-value { color: #ef4444; }
                .transactions-card .metric-value { color: #fbbf24; }
                .charts-row {
                    display: grid;
                    grid-template-columns: 1fr 0.8fr;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .chart-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }
                .chart-card h3 { color: #f8fafc; font-size: 1.125rem; margin-bottom: 1rem; }
                .chart-wrapper { height: 320px; }
                .donut-wrapper { height: 280px; display: flex; justify-content: center; align-items: center; }
                .no-data-message {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                    font-size: 0.875rem;
                }
                .recent-transactions {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }
                .recent-transactions h3 { color: #f8fafc; font-size: 1.125rem; margin-bottom: 1rem; }
                .table-wrapper { overflow-x: auto; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid rgba(148, 163, 184, 0.2); }
                th { color: #94a3b8; font-weight: 600; font-size: 0.875rem; }
                td { color: #f8fafc; }
                .type-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .badge-receita { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
                .badge-despesa { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
                .value-receita { color: #22c55e; font-weight: 600; }
                .value-despesa { color: #ef4444; font-weight: 600; }
                .dashboard-loading {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    color: #f8fafc;
                }
                @media (max-width: 768px) {
                    .dashboard-container { padding: 1rem; }
                    .charts-row { grid-template-columns: 1fr; }
                    .dashboard-header { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;