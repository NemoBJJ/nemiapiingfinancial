import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Database.css';

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

    return (
        <div className="database">
            <h2>Banco de Dados - Transações</h2>
            <table>
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
                            <td>{transaction.description}</td>
                            <td>R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.type}</td>
                            <td>{transaction.transaction_category}</td>
                            <td>{transaction.transaction_month}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={page === 0}>
                    Página Anterior
                </button>
                <span>
                    Página {page + 1} de {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                    Próxima Página
                </button>
            </div>
            {/* Botão para voltar ao menu */}
            <div className="back-to-menu">
                <Link to="/">
                    <button className="back-button">Voltar ao Menu</button>
                </Link>
            </div>
        </div>
    );
};

export default Database;
