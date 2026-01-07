import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
    const { logoutUser, user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="main-layout">
            {/* Navbar superior */}
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="hamburger-btn" onClick={toggleSidebar}>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                    <h1 className="navbar-title">Campus360</h1>
                </div>
                <div className="navbar-right">
                    <span className="user-welcome">Bienvenido, {user?.name || 'Usuario'}</span>
                    <div className="user-avatar">{(user?.name || 'U')[0].toUpperCase()}</div>
                </div>
            </nav>

            <div className="content-wrapper">
                {/* Sidebar colapsable */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                    <nav className="sidebar-nav">
                        <Link to="/reservas" className="nav-link">
                            <span className="nav-icon">📅</span>
                            {sidebarOpen && <span>Reservas</span>}
                        </Link>
                        <Link to="/incidencias" className="nav-link">
                            <span className="nav-icon">⚠️</span>
                            {sidebarOpen && <span>Incidencias</span>}
                        </Link>
                        <div className="nav-divider"></div>
                        <button onClick={logoutUser} className="nav-link logout-btn">
                            <span className="nav-icon">🚪</span>
                            {sidebarOpen && <span>Cerrar Sesión</span>}
                        </button>
                    </nav>
                </aside>

                {/* Contenido principal */}
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
