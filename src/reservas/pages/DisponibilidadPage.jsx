import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getRecursos, getRecursoById, getDisponibilidadRecurso, createReserva } from '../../api/services/reservas';
import { useAuth } from '../../contexts/AuthContext';
import '../styles/DisponibilidadPage.css';

/**
 * Página para ver la disponibilidad de recursos y crear reservas
 */
const DisponibilidadPage = () => {
    const { tipo } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [recursos, setRecursos] = useState([]);
    const [recursoSeleccionado, setRecursoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [disponibilidad, setDisponibilidad] = useState(null);
    const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

    // Form de reserva
    const [formData, setFormData] = useState({
        fecha: new Date(),
        hora_inicio: '08:00',
        hora_fin: '10:00',
        motivo: '',
        num_asistentes: 1
    });

    // Mapeo de títulos según backend
    const titulosPorTipo = {
        sala_estudio: 'Salas de Estudio',
        laboratorio: 'Laboratorios',
        equipo: 'Equipos',
        parqueadero: 'Estacionamientos',
        modulo_biblioteca: 'Módulos de Biblioteca'
    };

    useEffect(() => {
        cargarRecursos();
    }, [tipo]);

    const cargarRecursos = async () => {
        try {
            setLoading(true);
            const response = await getRecursos(tipo, 'disponible');
            setRecursos(response.data || []);
        } catch (error) {
            console.error('Error al cargar recursos:', error);
            alert('Error al cargar los recursos');
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionarRecurso = async (recurso) => {
        try {
            setLoading(true);
            // Obtener datos frescos del recurso desde el backend
            const response = await getRecursoById(recurso.id);
            if (response.success) {
                setRecursoSeleccionado(response.data);
                setShowModal(true);
                // Cargar disponibilidad para hoy
                cargarDisponibilidad(response.data.id, new Date());
            }
        } catch (error) {
            console.error('Error al obtener detalles del recurso:', error);
            alert('Error al cargar los detalles del recurso');
        } finally {
            setLoading(false);
        }
    };

    const cargarDisponibilidad = async (recursoId, fecha) => {
        try {
            setLoadingDisponibilidad(true);
            const fechaStr = fecha.toISOString().split('T')[0];
            const response = await getDisponibilidadRecurso(recursoId, fechaStr);

            if (response.success) {
                setDisponibilidad(response.data);
            }
        } catch (error) {
            console.error('Error al cargar disponibilidad:', error);
        } finally {
            setLoadingDisponibilidad(false);
        }
    };

    const handleFechaChange = (date) => {
        setFormData(prev => ({ ...prev, fecha: date }));
        setHorarioSeleccionado(null); // Reset selección al cambiar fecha
        if (recursoSeleccionado) {
            cargarDisponibilidad(recursoSeleccionado.id, date);
        }
    };

    const handleSeleccionarHorario = (horario) => {
        console.log('Horario seleccionado:', horario);
        setHorarioSeleccionado(horario);
        setFormData(prev => ({
            ...prev,
            hora_inicio: horario.inicio,
            hora_fin: horario.fin
        }));
        console.log('Formulario actualizado con:', { hora_inicio: horario.inicio, hora_fin: horario.fin });
    };

    const esHorarioDisponible = (horaInicio, horaFin) => {
        if (!disponibilidad || !disponibilidad.horarios_ocupados) return true;

        const inicio = horaInicio.replace(':', '');
        const fin = horaFin.replace(':', '');

        for (const ocupado of disponibilidad.horarios_ocupados) {
            const ocupadoInicio = ocupado.inicio.substring(0, 5).replace(':', '');
            const ocupadoFin = ocupado.fin.substring(0, 5).replace(':', '');

            // Verificar si hay solapamiento
            if (!(fin <= ocupadoInicio || inicio >= ocupadoFin)) {
                return false;
            }
        }
        return true;
    };

    const handleCrearReserva = async (e) => {
        e.preventDefault();

        if (!recursoSeleccionado || !user) {
            alert('Debe seleccionar un recurso y estar autenticado');
            return;
        }

        // Validar disponibilidad del horario
        if (!esHorarioDisponible(formData.hora_inicio, formData.hora_fin)) {
            alert('El horario seleccionado ya está ocupado. Por favor elige otro horario.');
            return;
        }

        try {
            const reservaData = {
                recurso_id: recursoSeleccionado.id,
                fecha: formData.fecha.toISOString().split('T')[0],
                hora_inicio: formData.hora_inicio,
                hora_fin: formData.hora_fin,
                usuario_id: user.id || 'user-temp-id',
                usuario_nombre: user.nombre || user.email || 'Usuario',
                usuario_email: user.email || 'temp@email.com',
                motivo: formData.motivo,
                num_asistentes: parseInt(formData.num_asistentes)
            };

            await createReserva(reservaData);
            alert('¡Reserva creada exitosamente!');
            setShowModal(false);
            navigate('/reservas/mis-reservas');
        } catch (error) {
            console.error('Error al crear reserva:', error);
            alert(error.response?.data?.detail || 'Error al crear la reserva');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div className="loading">Cargando recursos disponibles...</div>;
    }

    return (
        <div className="disponibilidad-page">
            <div className="disponibilidad-header">
                <button className="btn-back" onClick={() => navigate('/reservas')}>
                    ← Volver a recursos
                </button>
                <h1>Disponibilidad de recursos</h1>
                <h2 className="subtitle">{titulosPorTipo[tipo] || 'Recursos'}</h2>
                <div className="header-accent-line"></div>
            </div>

            <div className="recursos-grid-disponibilidad">
                {recursos.map((recurso) => (
                    <div key={recurso.id} className="recurso-card-grid">
                        <div className="recurso-card-header">
                            <h3>{recurso.nombre}</h3>
                            <span className={`estado-badge-small ${recurso.estado}`}>
                                {recurso.estado === 'disponible' ? 'Disponible' :
                                    recurso.estado === 'ocupado' ? 'Ocupado' :
                                        'Mantenimiento'}
                            </span>
                        </div>

                        <div className="recurso-card-body">
                            <div className="recurso-info-item">
                                <span className="icon">📍</span>
                                <span>{recurso.ubicacion || 'Sin ubicación'}</span>
                            </div>
                            <div className="recurso-info-item">
                                <span className="icon">👥</span>
                                <span>Capacidad: {recurso.capacidad} personas</span>
                            </div>

                            {/* Equipamiento del backend */}
                            {recurso.equipamiento && recurso.equipamiento.length > 0 && (
                                <div className="recurso-features">
                                    {recurso.equipamiento.map((equipo, idx) => (
                                        <span key={idx} className="feature-tag">{equipo}</span>
                                    ))}
                                </div>
                            )}

                            {/* Horario disponible */}
                            {recurso.horario_inicio && recurso.horario_fin && (
                                <div className="recurso-info-item">
                                    <span className="icon">🕐</span>
                                    <span>{recurso.horario_inicio.substring(0, 5)} - {recurso.horario_fin.substring(0, 5)}</span>
                                </div>
                            )}
                        </div>

                        <button
                            className="btn-reservar-grid"
                            onClick={() => handleSeleccionarRecurso(recurso)}
                            disabled={recurso.estado !== 'disponible'}
                        >
                            Reservar
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal de reserva - Vista completa */}
            {showModal && recursoSeleccionado && (
                <div className="modal-overlay-fullscreen" onClick={() => setShowModal(false)}>
                    <div className="modal-content-fullscreen" onClick={(e) => e.stopPropagation()}>
                        {/* Header del modal */}
                        <div className="modal-header-fullscreen">
                            <button className="btn-back-modal" onClick={() => setShowModal(false)}>
                                ← Volver
                            </button>
                            <h2>Nueva reserva</h2>
                        </div>

                        <div className="modal-body-fullscreen">
                            {/* Columna izquierda - Info del recurso */}
                            <div className="columna-info-recurso">
                                <h3>{titulosPorTipo[tipo] || 'Recursos'}</h3>
                                <h4>{recursoSeleccionado.nombre}</h4>
                                <p className="recurso-codigo">{recursoSeleccionado.codigo}</p>

                                <div className="recurso-visual">
                                    {recursoSeleccionado.imagen_url ? (
                                        <img
                                            src={recursoSeleccionado.imagen_url}
                                            alt={recursoSeleccionado.nombre}
                                            className="recurso-imagen"
                                        />
                                    ) : (
                                        <div className="recurso-placeholder">
                                            <span className="placeholder-icon">🏢</span>
                                        </div>
                                    )}
                                    <div className="recurso-detalles">
                                        <p className="detalle-ubicacion">📍 {recursoSeleccionado.ubicacion || 'Sin ubicación especificada'}</p>
                                        <p className="detalle-capacidad">👥 Capacidad: {recursoSeleccionado.capacidad} personas</p>
                                        {recursoSeleccionado.horario_inicio && (
                                            <p className="detalle-horario">🕐 Horario: {recursoSeleccionado.horario_inicio.substring(0, 5)} - {recursoSeleccionado.horario_fin.substring(0, 5)}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Descripción del recurso */}
                                {recursoSeleccionado.descripcion && (
                                    <div className="recurso-descripcion">
                                        <h5>Descripción</h5>
                                        <p>{recursoSeleccionado.descripcion}</p>
                                    </div>
                                )}

                                {/* Equipamiento disponible */}
                                {recursoSeleccionado.equipamiento && recursoSeleccionado.equipamiento.length > 0 && (
                                    <div className="recurso-equipamiento">
                                        <h5>Equipamiento</h5>
                                        <ul>
                                            {recursoSeleccionado.equipamiento.map((item, idx) => (
                                                <li key={idx}>✓ {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Restricciones del recurso */}
                                {recursoSeleccionado.restricciones && (
                                    <div className="recurso-restricciones">
                                        <h5>Restricciones</h5>
                                        <p>{recursoSeleccionado.restricciones}</p>
                                    </div>
                                )}
                            </div>

                            {/* Columna derecha - Formulario */}
                            <div className="columna-formulario">
                                <form onSubmit={handleCrearReserva} className="reserva-form-fullscreen">
                                    <div className="form-group-fullscreen">
                                        <label>Fecha de Reserva <span className="required">*</span></label>
                                        <DatePicker
                                            selected={formData.fecha}
                                            onChange={handleFechaChange}
                                            minDate={new Date()}
                                            dateFormat="dd/MM/yyyy"
                                            className="date-picker-input"
                                            placeholderText="Selecciona una fecha"
                                            required
                                        />
                                    </div>

                                    {/* Mostrar horarios disponibles */}
                                    {loadingDisponibilidad ? (
                                        <div className="loading-disponibilidad">
                                            <p>Cargando horarios disponibles...</p>
                                        </div>
                                    ) : disponibilidad && (
                                        <div className="disponibilidad-info">
                                            {disponibilidad.disponible ? (
                                                <>
                                                    <div className="disponibilidad-header">
                                                        <span className="icon-disponible">✓</span>
                                                        <span>Horarios disponibles para esta fecha</span>
                                                    </div>

                                                    {disponibilidad.horarios_disponibles && disponibilidad.horarios_disponibles.length > 0 && (
                                                        <div className="horarios-disponibles">
                                                            <p className="horarios-label">Haz click para seleccionar:</p>
                                                            {disponibilidad.horarios_disponibles.map((horario, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`horario-slot disponible ${horarioSeleccionado?.inicio === horario.inicio &&
                                                                        horarioSeleccionado?.fin === horario.fin
                                                                        ? 'seleccionado' : ''
                                                                        }`}
                                                                    onClick={() => handleSeleccionarHorario(horario)}
                                                                >
                                                                    {horario.inicio} - {horario.fin}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {disponibilidad.horarios_ocupados && disponibilidad.horarios_ocupados.length > 0 && (
                                                        <div className="horarios-ocupados-section">
                                                            <p className="horarios-label">Horarios ocupados:</p>
                                                            <div className="horarios-ocupados">
                                                                {disponibilidad.horarios_ocupados.map((horario, idx) => (
                                                                    <div key={idx} className="horario-slot ocupado">
                                                                        {horario.inicio.substring(0, 5)} - {horario.fin.substring(0, 5)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="no-disponible">
                                                    <span className="icon-no-disponible">✗</span>
                                                    <span>{disponibilidad.mensaje || 'No hay horarios disponibles para esta fecha'}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="form-row-fullscreen">
                                        <div className="form-group-fullscreen">
                                            <label>Hora de inicio <span className="required">*</span></label>
                                            <input
                                                type="time"
                                                name="hora_inicio"
                                                value={formData.hora_inicio}
                                                onChange={handleInputChange}
                                                placeholder="hh:mm"
                                                required
                                                disabled={horarioSeleccionado !== null}
                                            />
                                        </div>
                                        <div className="form-group-fullscreen">
                                            <label>Hora fin <span className="required">*</span></label>
                                            <input
                                                type="time"
                                                name="hora_fin"
                                                value={formData.hora_fin}
                                                onChange={handleInputChange}
                                                placeholder="hh:mm"
                                                required
                                                disabled={horarioSeleccionado !== null}
                                            />
                                        </div>
                                    </div>

                                    {/* Validación visual del horario */}
                                    {formData.hora_inicio && formData.hora_fin && !esHorarioDisponible(formData.hora_inicio, formData.hora_fin) && (
                                        <div className="alerta-horario-ocupado">
                                            ⚠️ Este horario ya está ocupado. Por favor elige otro.
                                        </div>
                                    )}

                                    <div className="form-group-fullscreen">
                                        <label>Notas (Opcional)</label>
                                        <textarea
                                            name="motivo"
                                            value={formData.motivo}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Opcional"
                                        />
                                    </div>

                                    <div className="form-checkbox">
                                        <input type="checkbox" id="aceptar-normas" required />
                                        <label htmlFor="aceptar-normas">Aceptar normas de uso</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-confirmar-reserva"
                                        disabled={!disponibilidad?.disponible || !esHorarioDisponible(formData.hora_inicio, formData.hora_fin)}
                                    >
                                        Confirmar reserva
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisponibilidadPage;
