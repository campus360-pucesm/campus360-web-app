import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Calendar, CheckSquare, AlertTriangle, CreditCard, Settings, LogOut, GraduationCap } from 'lucide-react';
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
                { path: '/', icon: Home, label: 'Inicio', exact: true }
            ]
        },
        {
            section: 'Servicios',
            items: [
                { path: '/reservas', icon: Calendar, label: 'Reservas' },
                { path: '/asistencia', icon: CheckSquare, label: 'Asistencia' },
                { path: '/incidencias', icon: AlertTriangle, label: 'Incidencias' }
            ]
        },
        {
            section: 'Mi Cuenta',
            items: [
                { path: '/credencial', icon: CreditCard, label: 'Mi Credencial' }
            ]
        }
    ];

    // Agregar sección de admin si el usuario es admin
    if (user?.role === 'admin') {
        menuItems.push({
            section: 'Administración',
            items: [
                { path: '/admin', icon: Settings, label: 'Panel Admin' }
            ]
        });
    }

    return (
        <div className={`main-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <GraduationCap className="logo-icon" size={28} />
                        {!sidebarCollapsed && <span className="logo-text">Campus360</span>}
                    </div>
                    <button 
                        className="toggle-btn"
                        onClick={() => setSidebarCollapsed(prev => !prev)}
                        aria-label={sidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
                        title={sidebarCollapsed ? 'Expandir' : 'Colapsar'}
                    >
                        <svg
                            className={`toggle-icon ${sidebarCollapsed ? '' : 'rotated'}`}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((section, idx) => (
                        <div key={idx} className="nav-section">
                            {!sidebarCollapsed && (
                                <span className="nav-section-title">{section.section}</span>
                            )}
                            {section.items.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.exact}
                                        className={({ isActive }) => 
                                            `nav-item ${isActive ? 'active' : ''}`
                                        }
                                        title={sidebarCollapsed ? item.label : ''}
                                    >
                                        <IconComponent className="nav-icon" size={20} />
                                        {!sidebarCollapsed && (
                                            <span className="nav-label">{item.label}</span>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut className="nav-icon" size={20} />
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