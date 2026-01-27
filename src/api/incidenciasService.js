import gateway from './gateway';

/**
 * Servicio para el módulo de Incidencias
 * Todas las llamadas a la API de incidencias pasan por aquí
 */

// =============================================
// CATÁLOGOS
// =============================================

export const getEstados = async () => {
    const response = await gateway.get('/tickets/catalogos/estados');
    return response.data;
};

export const getPrioridades = async () => {
    const response = await gateway.get('/tickets/catalogos/prioridades');
    return response.data;
};

export const getCategorias = async () => {
    const response = await gateway.get('/tickets/catalogos/categorias');
    return response.data;
};

export const getUbicaciones = async () => {
    const response = await gateway.get('/tickets/catalogos/ubicaciones');
    return response.data;
};

// =============================================
// TICKETS
// =============================================

/**
 * Obtener lista de tickets con filtros opcionales
 * @param {Object} filters - Filtros: estado_codigo, prioridad_codigo, categoria_codigo, limit, offset
 */
export const getTickets = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.estado_codigo) params.append('estado_codigo', filters.estado_codigo);
    if (filters.prioridad_codigo) params.append('prioridad_codigo', filters.prioridad_codigo);
    if (filters.categoria_codigo) params.append('categoria_codigo', filters.categoria_codigo);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const response = await gateway.get(`/tickets/?${params.toString()}`);
    return response.data;
};

/**
 * Obtener un ticket por ID
 * @param {number} ticketId - ID del ticket
 */
export const getTicketById = async (ticketId) => {
    const response = await gateway.get(`/tickets/${ticketId}`);
    return response.data;
};

/**
 * Crear un nuevo ticket
 * @param {Object} ticketData - Datos del ticket: titulo, descripcion, prioridad_codigo, categoria_codigo?, ubicacion_codigo?
 */
export const createTicket = async (ticketData) => {
    const response = await gateway.post('/tickets/', ticketData);
    return response.data;
};

/**
 * Actualizar un ticket existente
 * @param {number} ticketId - ID del ticket
 * @param {Object} updateData - Datos a actualizar: titulo?, descripcion?, prioridad_codigo?
 */
export const updateTicket = async (ticketId, updateData) => {
    const response = await gateway.put(`/tickets/${ticketId}`, updateData);
    return response.data;
};

/**
 * Eliminar un ticket
 * @param {number} ticketId - ID del ticket
 */
export const deleteTicket = async (ticketId) => {
    const response = await gateway.delete(`/tickets/${ticketId}`);
    return response.data;
};

// =============================================
// ACCIONES SOBRE TICKETS
// =============================================

/**
 * Cambiar el estado de un ticket
 * @param {number} ticketId - ID del ticket
 * @param {Object} data - { estado_codigo, comentario? }
 */
export const cambiarEstado = async (ticketId, data) => {
    const response = await gateway.post(`/tickets/${ticketId}/cambiar-estado`, data);
    return response.data;
};

/**
 * Asignar un responsable a un ticket
 * @param {number} ticketId - ID del ticket
 * @param {Object} data - { responsable_id, comentario? }
 */
export const asignarResponsable = async (ticketId, data) => {
    const response = await gateway.post(`/tickets/${ticketId}/asignar`, data);
    return response.data;
};

// =============================================
// HISTORIAL Y COMENTARIOS
// =============================================

/**
 * Obtener el historial de cambios de un ticket
 * @param {number} ticketId - ID del ticket
 */
export const getHistorial = async (ticketId) => {
    const response = await gateway.get(`/tickets/${ticketId}/historial`);
    return response.data;
};

/**
 * Obtener los comentarios de un ticket
 * @param {number} ticketId - ID del ticket
 * @param {boolean} incluirInternos - Incluir comentarios internos
 */
export const getComentarios = async (ticketId, incluirInternos = true) => {
    const params = incluirInternos ? '?incluir_internos=true' : '';
    const response = await gateway.get(`/tickets/${ticketId}/comentarios${params}`);
    return response.data;
};

/**
 * Agregar un comentario a un ticket
 * @param {number} ticketId - ID del ticket
 * @param {Object} data - { contenido, es_interno }
 */
export const addComentario = async (ticketId, data) => {
    const response = await gateway.post(`/tickets/${ticketId}/comentarios`, data);
    return response.data;
};
