import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

/**
 * Dashboard Principal de CAMPUS360
 * Muestra todos los módulos disponibles del sistema
 */
const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const modulos = [
        {
            id: 'reservas',
            nombre: 'Reservas',
            descripcion: 'Reserva salas de estudio, laboratorios, equipos y más',
            icono: '📅',
            color: '#e3f2fd',
            gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            ruta: '/reservas',
            disponible: true
        },
        {
            id: 'credencial',
            nombre: 'Mi Credencial',
            descripcion: 'Genera tu carnet digital y escanea códigos QR',
            icono: '🪪',
            color: '#f3e5f5',
            gradiente: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            ruta: '/auth/dashboard',
            disponible: true
        },
        {
            id: 'asistencia',
            nombre: 'Asistencia',
            descripcion: 'Consulta tu historial y reportes de asistencia',
            icono: '✅',
            color: '#e8f5e9',
            gradiente: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            ruta: '/asistencia',
            disponible: true
        },
        {
            id: 'incidencias',
            nombre: 'Incidencias',
            descripcion: 'Reporta problemas y da seguimiento a tus tickets',
            icono: '⚠️',
            color: '#fff3e0',
            gradiente: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
            ruta: '/incidencias',
            disponible: true
        }
    ];

    // Agregar módulo de admin solo si el usuario es admin
    if (user?.role === 'admin') {
        modulos.push({
            id: 'admin',
            nombre: 'Administración',
            descripcion: 'Panel de administración del sistema',
            icono: '⚙️',
            color: '#ffebee',
            gradiente: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
            ruta: '/auth/admin',
            disponible: true
        });
    }

    const handleModuloClick = (modulo) => {
        if (modulo.disponible) {
            navigate(modulo.ruta);
        }
    };

    return (
        <div className="home-page">
            {/* Header de bienvenida */}
            <div className="home-header">
                <div className="welcome-content">
                    <h1 className="welcome-title">
                        ¡Hola, {user?.full_name || user?.nombre || user?.email?.split('@')[0] || 'Usuario'}! 👋
                    </h1>
                    <p className="welcome-subtitle">
                        Bienvenido al portal universitario. ¿Qué deseas hacer hoy?
                    </p>
                </div>
                <div className="user-info-card">
                    <div className="user-avatar">
                        {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                        <span className="user-name">{user?.full_name || user?.email}</span>
                        <span className={`user-role role-${user?.role || 'student'}`}>
                            {user?.role === 'admin' ? 'Administrador' : 
                             user?.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid de módulos */}
            <div className="modulos-section">
                <h2 className="section-title">Módulos Disponibles</h2>
                <div className="modulos-grid">
                    {modulos.map((modulo) => (
                        <div
                            key={modulo.id}
                            className={`modulo-card ${!modulo.disponible ? 'disabled' : ''}`}
                            style={{ backgroundColor: modulo.color }}
                            onClick={() => handleModuloClick(modulo)}
                        >
                            <div className="modulo-icon-container" style={{ background: modulo.gradiente }}>
                                <span className="modulo-icon">{modulo.icono}</span>
                            </div>
                            <div className="modulo-content">
                                <h3 className="modulo-nombre">{modulo.nombre}</h3>
                                <p className="modulo-descripcion">{modulo.descripcion}</p>
                            </div>
                            {!modulo.disponible && (
                                <span className="coming-soon-badge">Próximamente</span>
                            )}
                            {modulo.disponible && (
                                <div className="modulo-arrow">→</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Accesos rápidos */}
            <div className="quick-actions">
                <h2 className="section-title">Accesos Rápidos</h2>
                <div className="quick-buttons">
                    <button 
                        className="quick-btn"
                        onClick={() => navigate('/reservas')}
                    >
                        <span>📅</span> Nueva Reserva
                    </button>
                    <button 
                        className="quick-btn"
                        onClick={() => navigate('/reservas/mis-reservas')}
                    >
                        <span>📋</span> Mis Reservas
                    </button>
                    <button 
                        className="quick-btn"
                        onClick={() => navigate('/auth/dashboard')}
                    >
                        <span>🪪</span> Mi Credencial
                    </button>
                    <button 
                        className="quick-btn"
                        onClick={() => navigate('/incidencias')}
                    >
                        <span>🆘</span> Reportar Problema
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;