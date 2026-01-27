import styles from '../../styles/Incidencias.module.css';

/**
 * Componente para mostrar el historial de cambios de un ticket
 */
const HistorialList = ({ historial }) => {
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

    if (!historial || historial.length === 0) {
        return <div className={styles.emptyState}>No hay historial</div>;
    }

    return (
        <div className={styles.historialContainer}>
            {historial.map((h, index) => (
                <div key={index} className={styles.historialItem}>
                    <div className={styles.historialFecha}>{formatDate(h.fecha_cambio)}</div>
                    <div className={styles.historialAccion}>{h.accion}</div>
                    {h.descripcion && <div>{h.descripcion}</div>}
                    {(h.valor_anterior || h.valor_nuevo) && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                            {h.valor_anterior && <span>Antes: {h.valor_anterior}</span>}
                            {h.valor_nuevo && <span> → Después: {h.valor_nuevo}</span>}
                        </div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>
                        Por: {h.usuario?.full_name || h.usuario?.email || 'Sistema'}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistorialList;
