import { useEffect } from 'react';
import styles from '../../styles/Incidencias.module.css';

/**
 * Componente Toast para notificaciones
 * @param {Object} props
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.type - Tipo: 'success', 'error', 'info'
 * @param {boolean} props.show - Mostrar/ocultar
 * @param {function} props.onClose - Callback al cerrar
 */
const Toast = ({ message, type = 'info', show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className={`${styles.toast} ${styles[`toast-${type}`]} ${show ? styles.show : ''}`}>
            {message}
        </div>
    );
};

export default Toast;
