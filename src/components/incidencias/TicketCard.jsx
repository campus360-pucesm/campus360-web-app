import styles from '../../styles/Incidencias.module.css';

/**
 * Tarjeta para mostrar un ticket en la lista
 */
const TicketCard = ({ ticket, onClick }) => {
    const getPrioridadClass = (codigo) => {
        const classes = {
            'baja': 'badgePrioridadBaja',
            'media': 'badgePrioridadMedia',
            'alta': 'badgePrioridadAlta',
            'critica': 'badgePrioridadCritica'
        };
        return styles[classes[codigo]] || styles.badgeEstado;
    };

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

    return (
        <div className={styles.ticketCard} onClick={() => onClick(ticket.id)}>
            <div className={styles.ticketHeader}>
                <span className={styles.ticketId}>#{ticket.id}</span>
                <span className={`${styles.badge} ${styles[`estado-${ticket.estado.codigo}`]}`}>
                    {ticket.estado.nombre}
                </span>
            </div>
            <div className={styles.ticketTitle}>{ticket.titulo}</div>
            <div className={styles.ticketMeta}>
                <span>📁 {ticket.categoria?.nombre || 'Sin categoría'}</span>
                <span className={`${styles.badge} ${getPrioridadClass(ticket.prioridad.codigo)}`}>
                    {ticket.prioridad.nombre}
                </span>
                <span>👤 {ticket.reportante?.full_name || ticket.reportante?.email || 'Anónimo'}</span>
                <span>📅 {formatDate(ticket.fecha_creacion)}</span>
            </div>
        </div>
    );
};

export default TicketCard;
