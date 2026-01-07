import gateway from '../gateway';

/**
 * Servicio API del Módulo de Reservas
 * 
 * Conecta con el backend FastAPI en puerto 8001
 * Backend: campus360-reservas/app/
 * 
 * Contiene todos los endpoints relacionados con el sistema de reservas:
 * - Gestión de recursos (salas, laboratorios, equipos, etc.)
 * - Gestión de reservas (crear, consultar, cancelar)
 * - Disponibilidad de recursos
 * 
 * IMPORTANTE: Las rutas están prefijadas según los routers del backend:
 * - /recursos/* → app/routers/recursos.py
 * - /reservas/* → app/routers/reservas.py
 */

// ==================== RECURSOS ====================
// Recursos son los elementos que se pueden reservar (salas, laboratorios, etc.)
// Backend: app/routers/recursos.py

/**
 * Listar todos los recursos con filtros opcionales
 * Backend: GET /recursos/
 * @param {string} tipo - Tipo de recurso (sala_estudio, laboratorio, equipo, parqueadero, modulo_biblioteca)
 * @param {string} estado - Estado del recurso (disponible, ocupado, etc.)
 * @param {number} page - Número de página
 * @param {number} pageSize - Tamaño de página
 */
export const getRecursos = async (tipo = null, estado = 'disponible', page = 1, pageSize = 50) => {
    const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
    });
    
    if (tipo) params.append('tipo', tipo);
    if (estado) params.append('estado', estado);
    
    const response = await gateway.get(`/recursos?${params.toString()}`);
    return response.data;
};

/**
 * Obtener tipos de recursos disponibles con resumen
 * Backend: GET /recursos/tipos
 */
export const getTiposRecursos = async () => {
    const response = await gateway.get('/recursos/tipos');
    return response.data;
};

/**
 * Obtener disponibilidad de un recurso específico
 * Backend: GET /recursos/{recurso_id}/disponibilidad
 * @param {string} recursoId - ID del recurso
 * @param {string} fecha - Fecha en formato YYYY-MM-DD (requerida)
 */
export const getDisponibilidadRecurso = async (recursoId, fecha) => {
    const params = new URLSearchParams({ fecha });
    
    const response = await gateway.get(`/recursos/${recursoId}/disponibilidad?${params.toString()}`);
    return response.data;
};

/**
 * Obtener detalles de un recurso específico
 * Backend: GET /recursos/{recurso_id}
 * @param {string} recursoId - ID del recurso
 */
export const getRecursoById = async (recursoId) => {
    const response = await gateway.get(`/recursos/${recursoId}`);
    return response.data;
};

// ==================== RESERVAS ====================
// Reservas son las solicitudes de uso de recursos
// Backend: app/routers/reservas.py

/**
 * Obtener todas las reservas del usuario actual
 * Backend: GET /reservas/usuario/{usuario_id}
 * @param {string} usuarioId - ID del usuario
 * @param {string} estado - Filtrar por estado (pendiente, confirmada, en_curso, completada, cancelada)
 * @param {number} page - Número de página
 * @param {number} pageSize - Tamaño de página
 */
export const getReservas = async (usuarioId, estado = null, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
    });
    
    if (estado) params.append('estado', estado);
    
    const response = await gateway.get(`/reservas/usuario/${usuarioId}?${params.toString()}`);
    return response.data;
};

/**
 * Crear una nueva reserva
 * Backend: POST /reservas/
 * @param {Object} data - Datos de la reserva
 * @param {string} data.recurso_id - ID del recurso a reservar
 * @param {string} data.fecha - Fecha en formato YYYY-MM-DD
 * @param {string} data.hora_inicio - Hora de inicio en formato HH:MM
 * @param {string} data.hora_fin - Hora de fin en formato HH:MM
 * @param {string} data.usuario_id - ID del usuario
 * @param {string} data.usuario_nombre - Nombre del usuario
 * @param {string} data.usuario_email - Email del usuario
 * @param {string} data.motivo - Motivo de la reserva (opcional)
 * @param {number} data.num_asistentes - Número de asistentes esperados
 */
export const createReserva = async (data) => {
    const response = await gateway.post('/reservas/', data);
    return response.data;
};

/**
 * Obtener detalles de una reserva específica
 * Backend: GET /reservas/{reserva_id}
 * @param {string} reservaId - ID de la reserva
 */
export const getReservaById = async (reservaId) => {
    const response = await gateway.get(`/reservas/${reservaId}`);
    return response.data;
};

/**
 * Cancelar una reserva
 * Backend: DELETE /reservas/{reserva_id}
 * @param {string} reservaId - ID de la reserva
 * @param {string} motivo - Motivo de la cancelación
 */
export const cancelarReserva = async (reservaId, motivo = '') => {
    // Obtener el usuario del contexto (necesitamos el usuario_id para el backend)
    const params = new URLSearchParams({
        usuario_id: localStorage.getItem('user_id') || 'temp-user-id'
    });
    
    if (motivo) {
        params.append('motivo', motivo);
    }
    
    const response = await gateway.delete(`/reservas/${reservaId}?${params.toString()}`);
    return response.data;
};
