import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Transactions.css';
import { ArrowLeft } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Erro ao buscar transações:', error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="transactions">
            <h2>Lista de Transações</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.description}</td>
                            <td>R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td>{transaction.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="back-to-menu">
                <Link to="/">
                    <button className="back-button">
                        <ArrowLeft size={18} className="icon-back" />
                        Voltar ao Menu
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Transactions;