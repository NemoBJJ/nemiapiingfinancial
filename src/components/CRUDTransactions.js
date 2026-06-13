import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CRUDTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransactionId, setSelectedTransactionId] = useState('');
    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: '',
        date: '',
        type: '',
        transactionCategory: '',
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, []);

    const handleAddTransaction = async () => {
        if (!newTransaction.description || !newTransaction.amount || !newTransaction.type) {
            alert('Preencha Descrição, Valor e Tipo!');
            return;
        }
        try {
            const response = await api.post('/transactions', {
                ...newTransaction,
                amount: parseFloat(newTransaction.amount)
            });
            setTransactions([...transactions, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleUpdateTransaction = async () => {
        if (!selectedTransactionId) {
            alert('Informe um ID para atualizar.');
            return;
        }
        if (!newTransaction.description || !newTransaction.amount || !newTransaction.type) {
            alert('Preencha Descrição, Valor e Tipo!');
            return;
        }

        try {
            const response = await api.put(`/transactions/${selectedTransactionId}`, {
                ...newTransaction,
                amount: parseFloat(newTransaction.amount)
            });
            setTransactions(
                transactions.map((t) =>
                    t.id === parseInt(selectedTransactionId) ? response.data : t
                )
            );
            resetForm();
            setSelectedTransactionId('');
            alert('Transação atualizada com sucesso!');
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Erro ao atualizar');
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            try {
                await api.delete(`/transactions/${id}`);
                setTransactions(transactions.filter((t) => t.id !== id));
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    const handleFetchTransactionById = async () => {
        if (!selectedTransactionId) {
            alert('Digite um ID para buscar.');
            return;
        }

        try {
            const response = await api.get(`/transactions/${selectedTransactionId}`);
            setNewTransaction({
                description: response.data.description || '',
                amount: response.data.amount ?? '',
                date: response.data.date || '',
                type: response.data.type || '',
                transactionCategory: response.data.transactionCategory || '',
            });
        } catch (error) {
            console.error('Error fetching transaction:', error);
            alert('Transação não encontrada!');
        }
    };

    const resetForm = () => {
        setNewTransaction({
            description: '',
            amount: '',
            date: '',
            type: '',
            transactionCategory: '',
        });
    };

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined) return '0,00';
        return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    return (
        <div className="crud-container">
            <div className="crud-header">
                <Link to="/">
                    <button className="back-button-crud">← Voltar ao Menu</button>
                </Link>
                <h1>⚙️ Gerenciar Transações</h1>
            </div>

            <div className="crud-grid">
                {/* Formulário */}
                <div className="crud-card form-card">
                    <h3>📝 Adicionar / Atualizar</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Descrição *"
                            value={newTransaction.description}
                            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Valor *"
                            value={newTransaction.amount}
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        />
                        <input
                            type="date"
                            value={newTransaction.date}
                            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                        />
                        <select
                            value={newTransaction.type}
                            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                        >
                            <option value="">Selecione o Tipo *</option>
                            <option value="REVENUE">💰 Receita</option>
                            <option value="EXPENSE">💸 Despesa</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Categoria"
                            value={newTransaction.transactionCategory}
                            onChange={(e) =>
                                setNewTransaction({ ...newTransaction, transactionCategory: e.target.value })
                            }
                        />
                        <div className="form-buttons">
                            <button className="btn-add" onClick={handleAddTransaction}>Adicionar</button>
                            <button className="btn-update" onClick={handleUpdateTransaction}>Atualizar</button>
                        </div>
                    </div>
                </div>

                {/* Busca por ID */}
                <div className="crud-card search-card">
                    <h3>🔍 Buscar por ID</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Digite o ID"
                            value={selectedTransactionId}
                            onChange={(e) => setSelectedTransactionId(e.target.value)}
                        />
                        <button className="btn-search" onClick={handleFetchTransactionById}>Buscar</button>
                        <button className="btn-clear" onClick={resetForm}>Limpar</button>
                    </div>
                </div>

                {/* Lista de transações */}
                <div className="crud-card list-card">
                    <h3>📋 Lista de Transações ({transactions.length})</h3>
                    <div className="transactions-list">
                        {transactions.map((t) => (
                            <div key={t.id} className="transaction-item">
                                <div className="transaction-info">
                                    <span className="transaction-id">#{t.id}</span>
                                    <span className="transaction-desc">{t.description || '-'}</span>
                                    <span className={`transaction-amount ${t.type === 'REVENUE' ? 'amount-revenue' : 'amount-expense'}`}>
                                        {t.type === 'REVENUE' ? '💰' : '💸'} R$ {formatAmount(t.amount)}
                                    </span>
                                    <span className="transaction-type-badge">
                                        {t.type === 'REVENUE' ? 'Receita' : 'Despesa'}
                                    </span>
                                </div>
                                <button className="btn-delete" onClick={() => handleDeleteTransaction(t.id)}>
                                    🗑️ Excluir
                                </button>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="no-transactions">Nenhuma transação cadastrada</div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .crud-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    padding: 2rem;
                }

                .crud-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .crud-header h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .back-button-crud {
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

                .back-button-crud:hover {
                    background: rgba(255, 193, 7, 0.2);
                    border-color: #fbbf24;
                    transform: translateX(-4px);
                }

                .crud-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .crud-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }

                .list-card {
                    grid-column: span 2;
                }

                .crud-card h3 {
                    color: #f8fafc;
                    font-size: 1.125rem;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(255, 193, 7, 0.3);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .form-group input,
                .form-group select {
                    padding: 0.75rem;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    border-radius: 0.75rem;
                    color: #f8fafc;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #fbbf24;
                    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
                }

                .form-group input::placeholder {
                    color: #64748b;
                }

                .form-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.5rem;
                }

                .btn-add, .btn-update, .btn-search, .btn-clear {
                    padding: 0.75rem;
                    font-weight: 600;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex: 1;
                }

                .btn-add {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border: none;
                    color: white;
                }

                .btn-add:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
                }

                .btn-update {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    border: none;
                    color: white;
                }

                .btn-update:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }

                .btn-search {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    border: none;
                    color: white;
                }

                .btn-search:hover {
                    transform: translateY(-2px);
                }

                .btn-clear {
                    background: rgba(100, 116, 139, 0.3);
                    border: 1px solid rgba(255, 193, 7, 0.4);
                    color: #f8fafc;
                }

                .btn-clear:hover {
                    background: rgba(100, 116, 139, 0.5);
                }

                .transactions-list {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .transaction-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    margin-bottom: 0.5rem;
                    background: rgba(30, 41, 59, 0.4);
                    border-radius: 0.75rem;
                    transition: all 0.2s ease;
                }

                .transaction-item:hover {
                    background: rgba(30, 41, 59, 0.6);
                    transform: translateX(4px);
                }

                .transaction-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .transaction-id {
                    font-size: 0.75rem;
                    color: #fbbf24;
                    font-weight: 600;
                }

                .transaction-desc {
                    color: #f8fafc;
                    font-size: 0.875rem;
                }

                .transaction-amount {
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .amount-revenue {
                    color: #22c55e;
                }

                .amount-expense {
                    color: #ef4444;
                }

                .transaction-type-badge {
                    font-size: 0.7rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    background: rgba(255, 193, 7, 0.15);
                    color: #fbbf24;
                }

                .btn-delete {
                    padding: 0.5rem 1rem;
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    border-radius: 0.5rem;
                    color: #ef4444;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-delete:hover {
                    background: rgba(239, 68, 68, 0.4);
                    transform: scale(1.02);
                }

                .no-transactions {
                    text-align: center;
                    color: #64748b;
                    padding: 2rem;
                }

                @media (max-width: 768px) {
                    .crud-container {
                        padding: 1rem;
                    }
                    .crud-grid {
                        grid-template-columns: 1fr;
                    }
                    .list-card {
                        grid-column: span 1;
                    }
                    .crud-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .transaction-info {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.25rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CRUDTransactions;