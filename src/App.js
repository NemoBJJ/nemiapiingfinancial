import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import Database from './components/Database';
import CRUDTransactions from './components/CRUDTransactions';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/database" element={<Database />} />
                <Route path="/crud-transactions" element={<CRUDTransactions />} />
            </Routes>
        </Router>
    );
}

export default App;