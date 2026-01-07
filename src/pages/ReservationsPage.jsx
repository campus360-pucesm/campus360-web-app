import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResourceCard from '../reservas/components/ResourceCard';
import { getTiposRecursos } from '../api/services/reservas';
import { useAuth } from '../contexts/AuthContext';
import '../reservas/styles/ReservationsPage.css';

/**
 * Página principal del Módulo de Reservas
 * Dashboard que muestra las categorías de recursos disponibles para reservar
 */
const ReservationsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tiposRecursos, setTiposRecursos] = useState([]);

    useEffect(() => {
        const cargarTiposRecursos = async () => {
            try {
                setLoading(true);
                setError(null);

                // Obtener tipos de recursos desde el backend
                const response = await getTiposRecursos();
                
                if (response.success && response.tipos_disponibles) {
                    // Mapear los tipos del backend al formato del frontend
                    const tipos = Object.entries(response.tipos_disponibles).map(([tipo, info]) => {
                        const nombresLegibles = {
                            sala_estudio: 'Salas de Estudio',
                            laboratorio: 'Laboratorios',
                            modulo_biblioteca: 'Módulos de Biblioteca',
                            parqueadero: 'Estacionamientos',
                            equipo: 'Equipos'
                        };

                        return {
                            tipo,
                            nombre: nombresLegibles[tipo] || tipo,
                            cantidad: info.cantidad,
                            capacidad: info.capacidad_tipica
                        };
                    });

                    setTiposRecursos(tipos);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar tipos de recursos:', err);
                setError('No se pudieron cargar los recursos. Verifica que el backend esté corriendo.');
                setLoading(false);
            }
        };

        cargarTiposRecursos();
    }, []);

    const handleVerDisponibilidad = (tipo) => {
        // Navegar a la página de disponibilidad con el tipo de recurso
        navigate(`/reservas/disponibilidad/${tipo}`);
    };

    if (loading) {
        return (
            <div className="recursos-page">
                <div className="loading">Cargando recursos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recursos-page">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="recursos-page">
            {/* Header con bienvenida y botón de Mis Reservas */}
            <div className="recursos-header">
                <div className="welcome-section">
                    <h1 className="page-title">Recursos del Campus</h1>
                    {user && (
                        <p className="welcome-text">
                            Bienvenido, {user.nombre || user.email || 'Usuario'}
                        </p>
                    )}
                </div>
                
                <button 
                    className="btn-mis-reservas"
                    onClick={() => navigate('/reservas/mis-reservas')}
                >
                    Mis reservas
                </button>
            </div>

            {/* Grid de recursos */}
            <div className="recursos-grid">
                {tiposRecursos.map((recurso) => (
                    <ResourceCard
                        key={recurso.tipo}
                        tipo={recurso.tipo}
                        nombre={recurso.nombre}
                        cantidad={recurso.cantidad}
                        capacidad={recurso.capacidad}
                        onVerDisponibilidad={handleVerDisponibilidad}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReservationsPage;
