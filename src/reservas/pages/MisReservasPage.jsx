import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservas, cancelarReserva } from '../../api/services/reservas';
import { useAuth } from '../../contexts/AuthContext';
import '../styles/MisReservasPage.css';

/**
 * Página para ver y gestionar las reservas del usuario
 */
const MisReservasPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('todas');

    useEffect(() => {
        cargarReservas();
    }, [user]);

    const cargarReservas = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const response = await getReservas(user.id || 'user-temp-id');
            setReservas(response.data || []);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (reservaId) => {
        if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        try {
            await cancelarReserva(reservaId, user.id, 'Cancelado por el usuario');
            alert('Reserva cancelada exitosamente');
            cargarReservas(); // Recargar la lista
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            alert('Error al cancelar la reserva');
        }
    };

    const getEstadoBadgeClass = (estado) => {
        const clases = {
            'pendiente': 'badge-pendiente',
            'confirmada': 'badge-confirmada',
            'en_curso': 'badge-en-curso',
            'completada': 'badge-completada',
            'cancelada': 'badge-cancelada',
            'no_show': 'badge-no-show'
        };
        return clases[estado] || 'badge-default';
    };

    const getEstadoTexto = (estado) => {
        const textos = {
            'pendiente': 'Pendiente',
            'confirmada': 'Confirmada',
            'en_curso': 'En Curso',
            'completada': 'Completada',
            'cancelada': 'Cancelada',
            'no_show': 'No Asistió'
        };
        return textos[estado] || estado;
    };

    const formatearFecha = (fecha) => {
        // El backend retorna fecha en formato "YYYY-MM-DD"
        try {
            const [year, month, day] = fecha.split('-');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return fecha;
        }
    };

    const formatearHora = (hora) => {
        // El backend retorna hora en formato "HH:MM:SS", mostrar solo "HH:MM"
        if (!hora) return '';
        return hora.substring(0, 5);
    };

    const reservasFiltradas = reservas.filter(reserva => {
        if (filtroEstado === 'todas') return true;
        if (filtroEstado === 'activas') {
            return ['pendiente', 'confirmada', 'en_curso'].includes(reserva.estado);
        }
        return reserva.estado === filtroEstado;
    });

    if (loading) {
        return <div className="loading">Cargando tus reservas...</div>;
    }

    return (
        <div className="mis-reservas-page">
            <div className="reservas-header">
                <div>
                    <button className="btn-back" onClick={() => navigate('/reservas')}>
                        ← Volver a recursos
                    </button>
                    <h1>Mis Reservas</h1>
                    <p className="subtitle">Gestiona y revisa tus reservas activas</p>
                </div>
                
                <button 
                    className="btn-nueva-reserva"
                    onClick={() => navigate('/reservas')}
                >
                    + Nueva Reserva
                </button>
            </div>

            {/* Filtros */}
            <div className="filtros-container">
                <button 
                    className={`filtro-btn ${filtroEstado === 'todas' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('todas')}
                >
                    Todas ({reservas.length})
                </button>
                <button 
                    className={`filtro-btn ${filtroEstado === 'activas' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('activas')}
                >
                    Activas ({reservas.filter(r => ['pendiente', 'confirmada', 'en_curso'].includes(r.estado)).length})
                </button>
                <button 
                    className={`filtro-btn ${filtroEstado === 'completada' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('completada')}
                >
                    Completadas
                </button>
                <button 
                    className={`filtro-btn ${filtroEstado === 'cancelada' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('cancelada')}
                >
                    Canceladas
                </button>
            </div>

            {/* Lista de reservas */}
            <div className="reservas-list">
                {reservasFiltradas.length === 0 ? (
                    <div className="no-reservas">
                        <p>No tienes reservas {filtroEstado !== 'todas' ? `en estado: ${filtroEstado}` : ''}</p>
                        <button 
                            className="btn-primera-reserva"
                            onClick={() => navigate('/reservas')}
                        >
                            Hacer mi primera reserva
                        </button>
                    </div>
                ) : (
                    reservasFiltradas.map((reserva) => (
                        <div key={reserva.id} className="reserva-card">
                            <div className="reserva-info">
                                <div className="reserva-header-card">
                                    <h3>{reserva.recurso?.nombre || 'Recurso'}</h3>
                                    <span className={`estado-badge ${getEstadoBadgeClass(reserva.estado)}`}>
                                        {getEstadoTexto(reserva.estado)}
                                    </span>
                                </div>
                                
                                <div className="reserva-detalles">
                                    <div className="detalle-item">
                                        <span className="icono">📅</span>
                                        <span>{formatearFecha(reserva.fecha)}</span>
                                    </div>
                                    <div className="detalle-item">
                                        <span className="icono">🕐</span>
                                        <span>{formatearHora(reserva.hora_inicio)} - {formatearHora(reserva.hora_fin)}</span>
                                    </div>
                                    {reserva.recurso?.ubicacion && (
                                        <div className="detalle-item">
                                            <span className="icono">📍</span>
                                            <span>{reserva.recurso.ubicacion}</span>
                                        </div>
                                    )}
                                    {reserva.recurso?.codigo && (
                                        <div className="detalle-item">
                                            <span className="icono">🔢</span>
                                            <span>Código: {reserva.recurso.codigo}</span>
                                        </div>
                                    )}
                                    {reserva.motivo && (
                                        <div className="detalle-item full-width">
                                            <span className="icono">📝</span>
                                            <span>{reserva.motivo}</span>
                                        </div>
                                    )}
                                    {reserva.num_asistentes_esperados && (
                                        <div className="detalle-item">
                                            <span className="icono">👥</span>
                                            <span>{reserva.num_asistentes_esperados} asistentes esperados</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="reserva-actions">
                                {(reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && (
                                    <>
                                        <button 
                                            className="btn-action btn-ver-qr"
                                            onClick={() => navigate(`/reservas/qr/${reserva.id}`)}
                                        >
                                            Ver QR
                                        </button>
                                        <button 
                                            className="btn-action btn-cancelar"
                                            onClick={() => handleCancelar(reserva.id)}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                )}
                                {reserva.estado === 'completada' && (
                                    <button 
                                        className="btn-action btn-repetir"
                                        onClick={() => navigate('/reservas')}
                                    >
                                        Reservar de nuevo
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MisReservasPage;
