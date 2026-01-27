import { useState } from 'react';
import styles from '../../styles/Incidencias.module.css';

/**
 * Componente para mostrar y agregar comentarios
 */
const ComentariosList = ({ comentarios, onAddComentario }) => {
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [esInterno, setEsInterno] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;
        
        onAddComentario({
            contenido: nuevoComentario,
            es_interno: esInterno
        });
        
        setNuevoComentario('');
        setEsInterno(false);
    };

    return (
        <div>
            <div className={styles.addCommentForm}>
                <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    rows="2"
                    placeholder="Escribe un comentario..."
                />
                <label>
                    <input
                        type="checkbox"
                        checked={esInterno}
                        onChange={(e) => setEsInterno(e.target.checked)}
                    />
                    {' '}Comentario interno
                </label>
                <button
                    onClick={handleSubmit}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    type="button"
                >
                    Agregar Comentario
                </button>
            </div>

            <div className={styles.comentariosContainer}>
                {!comentarios || comentarios.length === 0 ? (
                    <div className={styles.emptyState}>No hay comentarios</div>
                ) : (
                    comentarios.map((c, index) => (
                        <div
                            key={index}
                            className={`${styles.comentarioItem} ${c.es_interno ? styles.interno : ''}`}
                        >
                            <div className={styles.comentarioAutor}>
                                {c.usuario?.full_name || c.usuario?.email || 'Usuario'}
                                {c.es_interno && (
                                    <span className={`${styles.badge} ${styles.badgePrioridadAlta}`}>
                                        Interno
                                    </span>
                                )}
                            </div>
                            <div className={styles.comentarioFecha}>{formatDate(c.fecha_creacion)}</div>
                            <div style={{ marginTop: '0.5rem' }}>{c.contenido}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ComentariosList;
