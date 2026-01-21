import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

/**
 * Layout principal con sidebar y header
 * Ubicación: src/components/layouts/MainLayout.jsx
 */
const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Menú de navegación
    const menuItems = [
        {
            section: 'Principal',
            items: [
                { path: '/', icon: '🏠', label: 'Inicio', exact: true }
            ]
        },
        {
            section: 'Servicios',
            items: [
                { path: '/reservas', icon: '📅', label: 'Reservas' },
                { path: '/asistencia', icon: '✅', label: 'Asistencia' },
                { path: '/incidencias', icon: '⚠️', label: 'Incidencias' }
            ]
        },
        {
            section: 'Mi Cuenta',
            items: [
                { path: '/auth/dashboard', icon: '🪪', label: 'Mi Credencial' }
            ]
        }
    ];

    // Agregar sección de admin si el usuario es admin
    if (user?.role === 'admin') {
        menuItems.push({
            section: 'Administración',
            items: [
                { path: '/auth/admin', icon: '⚙️', label: 'Panel Admin' }
            ]
        });
    }

    return (
        <div className={`main-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">🎓</span>
                        {!sidebarCollapsed && <span className="logo-text">Campus360</span>}
                    </div>
                    <button 
                        className="toggle-btn"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((section, idx) => (
                        <div key={idx} className="nav-section">
                            {!sidebarCollapsed && (
                                <span className="nav-section-title">{section.section}</span>
                            )}
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.exact}
                                    className={({ isActive }) => 
                                        `nav-item ${isActive ? 'active' : ''}`
                                    }
                                    title={sidebarCollapsed ? item.label : ''}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    {!sidebarCollapsed && (
                                        <span className="nav-label">{item.label}</span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        {!sidebarCollapsed && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="main-content">
                {/* Header */}
                <header className="main-header">
                    <div className="header-left">
                        <button 
                            className="mobile-menu-btn"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            ☰
                        </button>
                    </div>
                    <div className="header-right">
                        <span className="user-greeting">
                            Bienvenido, {user?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                        </span>
                        <div className="user-avatar-small">
                            {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;