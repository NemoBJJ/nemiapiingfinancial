import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Database as DatabaseIcon, Coins, ArrowDownCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Database = () => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchTransactions(page);
    }, [page]);

    const fetchTransactions = async (currentPage) => {
        try {
            const response = await api.get(`/transactions/paged?page=${currentPage}&size=10`);
            setTransactions(response.data.content);
            setPage(response.data.number);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined) return 'R$ 0,00';
        return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    const getTypeClass = (type) => {
        if (type === 'REVENUE') return 'type-revenue';
        if (type === 'EXPENSE') return 'type-expense';
        return '';
    };

    const getTypeLabel = (type) => {
        if (type === 'REVENUE') return 'Receita';
        if (type === 'EXPENSE') return 'Despesa';
        return type || '-';
    };

    return (
        <div className="database-container">
            <div className="database-header">
                <Link to="/">
                    <button className="back-button-database">
                        <ArrowLeft size={18} className="icon-back" />
                        Voltar ao Menu
                    </button>
                </Link>
                <h1>
                    <DatabaseIcon size={28} className="icon-header" />
                    Banco de Dados
                </h1>
            </div>

            <div className="database-card">
                <div className="table-wrapper">
                    <table className="database-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Categoria</th>
                                <th>Mês</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.description || '-'}</td>
                                    <td className="amount-cell">
                                        {transaction.type === 'REVENUE' ? (
                                            <Coins size={16} className="icon-revenue" />
                                        ) : (
                                            <ArrowDownCircle size={16} className="icon-expense" />
                                        )}
                                        R$ {formatAmount(transaction.amount)}
                                    </td>
                                    <td>{transaction.date || '-'}</td>
                                    <td className={getTypeClass(transaction.type)}>
                                        {getTypeLabel(transaction.type)}
                                    </td>
                                    <td>{transaction.transactionCategory || '-'}</td>
                                    <td>{transaction.transactionMonth || '-'}</td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="no-data">Nenhuma transação encontrada</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-database">
                    <button onClick={handlePreviousPage} disabled={page === 0}>
                        <ChevronLeft size={18} />
                        Anterior
                    </button>
                    <span className="page-info">
                        Página {page + 1} de {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                        Próxima
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <style jsx="true">{`
                .database-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    padding: 2rem;
                }

                .database-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .database-header h1 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 2rem;
                    font-weight: bold;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .icon-back {
                    color: #f8fafc;
                    stroke-width: 2;
                    margin-right: 0.3rem;
                    vertical-align: middle;
                }

                .icon-header {
                    color: #fbbf24;
                    stroke-width: 2;
                }

                .icon-revenue {
                    color: #22c55e;
                    stroke-width: 2;
                    margin-right: 0.2rem;
                    vertical-align: middle;
                }

                .icon-expense {
                    color: #ef4444;
                    stroke-width: 2;
                    margin-right: 0.2rem;
                    vertical-align: middle;
                }

                .back-button-database {
                    display: inline-flex;
                    align-items: center;
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

                .back-button-database:hover {
                    background: rgba(255, 193, 7, 0.2);
                    border-color: #fbbf24;
                    transform: translateX(-4px);
                }

                .database-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }

                .table-wrapper {
                    overflow-x: auto;
                }

                .database-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .database-table th,
                .database-table td {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
                }

                .database-table th {
                    color: #fbbf24;
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .database-table td {
                    color: #f8fafc;
                    font-size: 0.875rem;
                }

                .database-table tr:hover td {
                    background: rgba(255, 193, 7, 0.05);
                }

                .amount-cell {
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.2rem;
                }

                .type-revenue {
                    color: #22c55e;
                    font-weight: 600;
                }

                .type-expense {
                    color: #ef4444;
                    font-weight: 600;
                }

                .no-data {
                    text-align: center;
                    color: #94a3b8;
                    padding: 2rem;
                }

                .pagination-database {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(148, 163, 184, 0.2);
                }

                .pagination-database button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #f8fafc;
                    background: rgba(255, 193, 7, 0.15);
                    border: 1px solid rgba(255, 193, 7, 0.4);
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .pagination-database button:hover:not(:disabled) {
                    background: rgba(255, 193, 7, 0.3);
                    border-color: #fbbf24;
                    transform: scale(1.02);
                }

                .pagination-database button:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .page-info {
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                @media (max-width: 768px) {
                    .database-container {
                        padding: 1rem;
                    }
                    .database-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .database-table th,
                    .database-table td {
                        padding: 0.5rem;
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Database;