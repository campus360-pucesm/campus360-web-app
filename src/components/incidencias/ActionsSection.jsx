import { useState } from 'react';
import styles from '../../styles/Incidencias.module.css';
import { cambiarEstado, asignarResponsable, updateTicket, deleteTicket } from '../../api/incidenciasService';

/**
 * Sección de acciones sobre tickets
 */
const ActionsSection = ({ onShowToast }) => {
    const [resultados, setResultados] = useState({
        estado: null,
        asignar: null,
        actualizar: null,
        eliminar: null
    });

    // Estado para cambiar estado
    const [estadoForm, setEstadoForm] = useState({
        ticketId: '',
        estadoCodigo: 'abierta',
        comentario: ''
    });

    // Estado para asignar responsable
    const [asignarForm, setAsignarForm] = useState({
        ticketId: '',
        responsableId: '',
        comentario: ''
    });

    // Estado para actualizar ticket
    const [updateForm, setUpdateForm] = useState({
        ticketId: '',
        titulo: '',
        descripcion: '',
        prioridadCodigo: ''
    });

    // Estado para eliminar ticket
    const [eliminarId, setEliminarId] = useState('');

    const showResult = (key, success, data) => {
        setResultados(prev => ({
            ...prev,
            [key]: { success, data }
        }));
    };

    const handleCambiarEstado = async () => {
        if (!estadoForm.ticketId) {
            onShowToast('Ingresa un ID de ticket', 'error');
            return;
        }

        try {
            const result = await cambiarEstado(estadoForm.ticketId, {
                estado_codigo: estadoForm.estadoCodigo,
                comentario: estadoForm.comentario || null
            });
            showResult('estado', true, result);
            onShowToast('Estado cambiado exitosamente', 'success');
        } catch (error) {
            showResult('estado', false, error.response?.data || error);
            onShowToast('Error al cambiar estado', 'error');
        }
    };

    const handleAsignarResponsable = async () => {
        if (!asignarForm.ticketId || !asignarForm.responsableId) {
            onShowToast('Completa todos los campos requeridos', 'error');
            return;
        }

        try {
            const result = await asignarResponsable(asignarForm.ticketId, {
                responsable_id: asignarForm.responsableId,
                comentario: asignarForm.comentario || null
            });
            showResult('asignar', true, result);
            onShowToast('Responsable asignado exitosamente', 'success');
        } catch (error) {
            showResult('asignar', false, error.response?.data || error);
            onShowToast('Error al asignar responsable', 'error');
        }
    };

    const handleActualizarTicket = async () => {
        if (!updateForm.ticketId) {
            onShowToast('Ingresa un ID de ticket', 'error');
            return;
        }

        const updateData = {};
        if (updateForm.titulo) updateData.titulo = updateForm.titulo;
        if (updateForm.descripcion) updateData.descripcion = updateForm.descripcion;
        if (updateForm.prioridadCodigo) updateData.prioridad_codigo = updateForm.prioridadCodigo;

        if (Object.keys(updateData).length === 0) {
            onShowToast('No hay cambios para actualizar', 'error');
            return;
        }

        try {
            const result = await updateTicket(updateForm.ticketId, updateData);
            showResult('actualizar', true, result);
            onShowToast('Ticket actualizado exitosamente', 'success');
        } catch (error) {
            showResult('actualizar', false, error.response?.data || error);
            onShowToast('Error al actualizar ticket', 'error');
        }
    };

    const handleEliminarTicket = async () => {
        if (!eliminarId) {
            onShowToast('Ingresa un ID de ticket', 'error');
            return;
        }

        if (!window.confirm(`¿Estás seguro de eliminar el ticket #${eliminarId}? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await deleteTicket(eliminarId);
            showResult('eliminar', true, { message: `Ticket #${eliminarId} eliminado` });
            onShowToast('Ticket eliminado exitosamente', 'success');
        } catch (error) {
            showResult('eliminar', false, error.response?.data || error);
            onShowToast('Error al eliminar ticket', 'error');
        }
    };

    return (
        <div>
            <h2>Acciones sobre Tickets</h2>

            {/* Cambiar Estado */}
            <div className={styles.actionCard}>
                <h3>🔄 Cambiar Estado</h3>
                <div className={styles.actionForm}>
                    <input
                        type="number"
                        placeholder="ID del ticket"
                        min="1"
                        value={estadoForm.ticketId}
                        onChange={(e) => setEstadoForm({ ...estadoForm, ticketId: e.target.value })}
                    />
                    <select
                        value={estadoForm.estadoCodigo}
                        onChange={(e) => setEstadoForm({ ...estadoForm, estadoCodigo: e.target.value })}
                    >
                        <option value="abierta">Abierta</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="resuelta">Resuelta</option>
                        <option value="cerrada">Cerrada</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Comentario (opcional)"
                        value={estadoForm.comentario}
                        onChange={(e) => setEstadoForm({ ...estadoForm, comentario: e.target.value })}
                    />
                    <button onClick={handleCambiarEstado} className={`${styles.btn} ${styles.btnWarning}`}>
                        Cambiar Estado
                    </button>
                </div>
                {resultados.estado && (
                    <div className={`${styles.resultContainer} ${resultados.estado.success ? styles.success : styles.error}`}>
                        <strong>{resultados.estado.success ? '✅ Operación exitosa' : '❌ Error'}</strong>
                        <pre>{JSON.stringify(resultados.estado.data, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* Asignar Responsable */}
            <div className={styles.actionCard}>
                <h3>👤 Asignar Responsable</h3>
                <div className={styles.actionForm}>
                    <input
                        type="number"
                        placeholder="ID del ticket"
                        min="1"
                        value={asignarForm.ticketId}
                        onChange={(e) => setAsignarForm({ ...asignarForm, ticketId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="ID del responsable"
                        value={asignarForm.responsableId}
                        onChange={(e) => setAsignarForm({ ...asignarForm, responsableId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Comentario (opcional)"
                        value={asignarForm.comentario}
                        onChange={(e) => setAsignarForm({ ...asignarForm, comentario: e.target.value })}
                    />
                    <button onClick={handleAsignarResponsable} className={`${styles.btn} ${styles.btnInfo}`}>
                        Asignar
                    </button>
                </div>
                {resultados.asignar && (
                    <div className={`${styles.resultContainer} ${resultados.asignar.success ? styles.success : styles.error}`}>
                        <strong>{resultados.asignar.success ? '✅ Operación exitosa' : '❌ Error'}</strong>
                        <pre>{JSON.stringify(resultados.asignar.data, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* Actualizar Ticket */}
            <div className={styles.actionCard}>
                <h3>✏️ Actualizar Ticket</h3>
                <div className={styles.actionForm}>
                    <input
                        type="number"
                        placeholder="ID del ticket"
                        min="1"
                        value={updateForm.ticketId}
                        onChange={(e) => setUpdateForm({ ...updateForm, ticketId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Nuevo título (opcional)"
                        value={updateForm.titulo}
                        onChange={(e) => setUpdateForm({ ...updateForm, titulo: e.target.value })}
                    />
                    <textarea
                        rows="2"
                        placeholder="Nueva descripción (opcional)"
                        value={updateForm.descripcion}
                        onChange={(e) => setUpdateForm({ ...updateForm, descripcion: e.target.value })}
                    />
                    <select
                        value={updateForm.prioridadCodigo}
                        onChange={(e) => setUpdateForm({ ...updateForm, prioridadCodigo: e.target.value })}
                    >
                        <option value="">Sin cambiar</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                    </select>
                    <button onClick={handleActualizarTicket} className={`${styles.btn} ${styles.btnPrimary}`}>
                        Actualizar
                    </button>
                </div>
                {resultados.actualizar && (
                    <div className={`${styles.resultContainer} ${resultados.actualizar.success ? styles.success : styles.error}`}>
                        <strong>{resultados.actualizar.success ? '✅ Operación exitosa' : '❌ Error'}</strong>
                        <pre>{JSON.stringify(resultados.actualizar.data, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* Eliminar Ticket */}
            <div className={`${styles.actionCard} ${styles.danger}`}>
                <h3>🗑️ Eliminar Ticket</h3>
                <div className={styles.actionForm}>
                    <input
                        type="number"
                        placeholder="ID del ticket"
                        min="1"
                        value={eliminarId}
                        onChange={(e) => setEliminarId(e.target.value)}
                    />
                    <button onClick={handleEliminarTicket} className={`${styles.btn} ${styles.btnDanger}`}>
                        Eliminar
                    </button>
                </div>
                {resultados.eliminar && (
                    <div className={`${styles.resultContainer} ${resultados.eliminar.success ? styles.success : styles.error}`}>
                        <strong>{resultados.eliminar.success ? '✅ Operación exitosa' : '❌ Error'}</strong>
                        <pre>{JSON.stringify(resultados.eliminar.data, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionsSection;
