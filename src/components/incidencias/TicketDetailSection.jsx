import { useState } from 'react';
import styles from '../../styles/Incidencias.module.css';
import HistorialList from './HistorialList';
import ComentariosList from './ComentariosList';
import { getTicketById, getHistorial, getComentarios, addComentario } from '../../api/incidenciasService';

/**
 * Sección de detalle de ticket
 */
const TicketDetailSection = ({ ticketIdProp, onShowToast }) => {
    const [ticketId, setTicketId] = useState(ticketIdProp || '');
    const [ticket, setTicket] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [showHistorial, setShowHistorial] = useState(false);
    const [showComentarios, setShowComentarios] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPrioridadClass = (codigo) => {
        const classes = {
            'baja': 'badgePrioridadBaja',
            'media': 'badgePrioridadMedia',
            'alta': 'badgePrioridadAlta',
            'critica': 'badgePrioridadCritica'
        };
        return styles[classes[codigo]] || styles.badgeEstado;
    };

    const buscarTicket = async () => {
        if (!ticketId) {
            onShowToast('Ingresa un ID de ticket', 'error');
            return;
        }

        try {
            const data = await getTicketById(ticketId);
            setTicket(data);
            setShowHistorial(true);
            setShowComentarios(true);
            onShowToast(`Ticket #${data.id} cargado`, 'success');
        } catch (error) {
            setTicket(null);
            setShowHistorial(false);
            setShowComentarios(false);
            onShowToast('Error al buscar ticket', 'error');
        }
    };

    const cargarHistorial = async () => {
        if (!ticket) return;
        
        try {
            const data = await getHistorial(ticket.id);
            setHistorial(data);
            onShowToast(`${data.length} registros en historial`, 'success');
        } catch (error) {
            onShowToast('Error al cargar historial', 'error');
        }
    };

    const cargarComentarios = async () => {
        if (!ticket) return;
        
        try {
            const data = await getComentarios(ticket.id, true);
            setComentarios(data);
            onShowToast(`${data.length} comentarios cargados`, 'success');
        } catch (error) {
            onShowToast('Error al cargar comentarios', 'error');
        }
    };

    const handleAddComentario = async (comentarioData) => {
        if (!ticket) return;
        
        try {
            await addComentario(ticket.id, comentarioData);
            onShowToast('Comentario agregado', 'success');
            cargarComentarios();
        } catch (error) {
            onShowToast('Error al agregar comentario', 'error');
        }
    };

    return (
        <div>
            <h2>Detalle de Ticket</h2>
            
            <div className={styles.searchTicket}>
                <input
                    type="number"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    placeholder="ID del ticket"
                    min="1"
                />
                <button onClick={buscarTicket} className={`${styles.btn} ${styles.btnPrimary}`}>
                    🔍 Buscar
                </button>
            </div>

            {ticket ? (
                <>
                    <div className={styles.ticketDetailContainer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Ticket #{ticket.id}</h3>
                            <span className={`${styles.badge} ${styles[`estado-${ticket.estado.codigo}`]}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                {ticket.estado.nombre}
                            </span>
                        </div>

                        <h4 style={{ marginBottom: '1rem' }}>{ticket.titulo}</h4>
                        <p style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f6fa', borderRadius: '8px' }}>
                            {ticket.descripcion}
                        </p>

                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Prioridad</div>
                                <div className={styles.detailValue}>
                                    <span className={`${styles.badge} ${getPrioridadClass(ticket.prioridad.codigo)}`}>
                                        {ticket.prioridad.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Categoría</div>
                                <div className={styles.detailValue}>{ticket.categoria?.nombre || 'Sin categoría'}</div>
                            </div>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Ubicación</div>
                                <div className={styles.detailValue}>{ticket.ubicacion?.nombre || 'Sin ubicación'}</div>
                            </div>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Reportante</div>
                                <div className={styles.detailValue}>{ticket.reportante?.full_name || ticket.reportante?.email || 'N/A'}</div>
                            </div>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Responsable</div>
                                <div className={styles.detailValue}>{ticket.responsable?.full_name || ticket.responsable?.email || 'Sin asignar'}</div>
                            </div>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Fecha Creación</div>
                                <div className={styles.detailValue}>{formatDate(ticket.fecha_creacion)}</div>
                            </div>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Última Actualización</div>
                                <div className={styles.detailValue}>{formatDate(ticket.fecha_actualizacion)}</div>
                            </div>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Fecha Resolución</div>
                                <div className={styles.detailValue}>{formatDate(ticket.fecha_resolucion)}</div>
                            </div>
                        </div>
                    </div>

                    {showHistorial && (
                        <div className={styles.subsection}>
                            <h3>📜 Historial de Cambios</h3>
                            <button onClick={cargarHistorial} className={`${styles.btn} ${styles.btnSecondary}`}>
                                Cargar Historial
                            </button>
                            <HistorialList historial={historial} />
                        </div>
                    )}

                    {showComentarios && (
                        <div className={styles.subsection}>
                            <h3>💬 Comentarios</h3>
                            <button onClick={cargarComentarios} className={`${styles.btn} ${styles.btnSecondary}`}>
                                Cargar Comentarios
                            </button>
                            <ComentariosList
                                comentarios={comentarios}
                                onAddComentario={handleAddComentario}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.emptyState}>Busca un ticket para ver su detalle</div>
            )}
        </div>
    );
};

export default TicketDetailSection;
