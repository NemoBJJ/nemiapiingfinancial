import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Transactions.css';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/transactions'); // Rota sem paginação
                setTransactions(response.data);
            } catch (error) {
                console.error('Erro ao buscar transações:', error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="transactions">
            <h2>Transactions List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.description}</td>
                            <td>${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td>{transaction.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="back-to-menu">
                <Link to="/">
                    <button className="back-button">Back to Menu</button>
                </Link>
            </div>
        </div>
    );
};

export default Transactions;
