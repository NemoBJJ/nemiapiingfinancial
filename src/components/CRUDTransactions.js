import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './CRUDTransactions.css';

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
        try {
            const response = await api.post('/transactions', newTransaction);
            setTransactions([...transactions, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleUpdateTransaction = async () => {
        if (!selectedTransactionId) {
            alert('Please provide a valid ID to update.');
            return;
        }

        try {
            const response = await api.put(`/transactions/${selectedTransactionId}`, newTransaction);
            setTransactions(
                transactions.map((t) =>
                    t.id === parseInt(selectedTransactionId) ? response.data : t
                )
            );
            resetForm();
            setSelectedTransactionId('');
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleFetchTransactionById = async () => {
        if (!selectedTransactionId) {
            alert('Please provide a valid ID to search.');
            return;
        }

        try {
            const response = await api.get(`/transactions/${selectedTransactionId}`);
            setNewTransaction({
                description: response.data.description,
                amount: response.data.amount,
                date: response.data.date,
                type: response.data.type,
                transactionCategory: response.data.transactionCategory,
            });
        } catch (error) {
            console.error('Error fetching transaction:', error);
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

    return (
        <div className="crud-container">
            <h1 className="crud-title">Manage Transactions</h1> {/* Title updated */}

            <div className="crud-section">
                <h3>Add or Update Transaction</h3> {/* Updated to English */}
                <input
                    type="text"
                    placeholder="Description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Amount"
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
                    <option value="">Select Type</option> {/* Updated */}
                    <option value="RECEITA">Revenue</option> {/* Updated */}
                    <option value="DESPESA">Expense</option> {/* Updated */}
                </select>
                <input
                    type="text"
                    placeholder="Category"
                    value={newTransaction.transactionCategory}
                    onChange={(e) =>
                        setNewTransaction({ ...newTransaction, transactionCategory: e.target.value })
                    }
                />
                <button onClick={handleAddTransaction}>Add</button> {/* Updated */}
                <button onClick={handleUpdateTransaction}>Update</button> {/* Updated */}
            </div>

            <div className="crud-section">
                <h3>Search Transaction by ID</h3> {/* Updated */}
                <input
                    type="text"
                    placeholder="Enter ID"
                    value={selectedTransactionId}
                    onChange={(e) => setSelectedTransactionId(e.target.value)}
                />
                <button onClick={handleFetchTransactionById}>Search</button> {/* Updated */}
            </div>

            <div className="transactions-list crud-section">
                <h3>Transaction List</h3> {/* Updated */}
                <ul>
                    {transactions.map((t) => (
                        <li key={t.id}>
                            ID: {t.id} - {t.description} - $
                            {t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {/* Updated */}
                            <button onClick={() => handleDeleteTransaction(t.id)}>Delete</button> {/* Updated */}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="back-to-menu">
                <Link to="/">
                    <button className="back-button">Back to Menu</button> {/* Updated */}
                </Link>
            </div>
        </div>
    );
};

export default CRUDTransactions;
