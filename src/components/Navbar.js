import React from 'react';

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <ul style={styles.navList}>
                <li style={styles.navItem}><a href="/" style={styles.navLink}>Dashboard</a></li>
                <li style={styles.navItem}><a href="/transactions" style={styles.navLink}>Transações</a></li>
                <li style={styles.navItem}><a href="/settings" style={styles.navLink}>Configurações</a></li>
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#333',
        padding: '10px 20px',
    },
    navList: {
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'space-around',
        margin: 0,
        padding: 0,
    },
    navItem: {
        fontSize: '18px',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    },
    navLinkHover: {
        backgroundColor: '#555',
    },
};

export default Navbar;
