import gateway from '../gateway';

/**
 * Servicio API del Módulo de Reservas
 * 
 * Conecta con el API Gateway en puerto 8000
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
 * 🔧 NO USADA - Disponible para dashboard admin
 * 
 * Endpoint genérico con múltiples filtros combinables.
 * NO se usa porque tenemos funciones más específicas:
 * - getReservas() para usuario individual (más optimizado)
 * - getReservasPorFecha() para consultas por fecha
 * 
 * Usar en futuro para: dashboard admin con filtros combinados,
 * reportes avanzados, búsquedas complejas.
 * 
 * @param {Object} filters - Filtros opcionales (usuario_id, fecha, tipo_recurso, estado, page, page_size)
 */
export const listarReservas = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.usuario_id) params.append('usuario_id', filters.usuario_id);
    if (filters.fecha) params.append('fecha', filters.fecha);
    if (filters.tipo_recurso) params.append('tipo_recurso', filters.tipo_recurso);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size) params.append('page_size', filters.page_size.toString());

    const response = await gateway.get(`/reservas/?${params.toString()}`);
    return response.data;
};

/**
 * ✅ USADA en MisReservasPage.jsx
 * 
 * Obtener reservas del usuario con endpoint dedicado /reservas/usuario/{id}.
 * 
 * Se usa este método en lugar de listarReservas() porque:
 * - Endpoint más semántico y optimizado para queries por usuario
 * - Mejor performance (índices específicos en backend)
 * - Código más legible: getReservas(userId) vs listarReservas({usuario_id: userId})
 * 
 * @param {string} usuarioId - ID del usuario
 * @param {string} estado - Filtrar por estado (confirmada, cancelada, etc.)
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
 * 🔧 NO USADA - Disponible para vista de detalle
 * 
 * Obtiene detalles completos de UNA reserva específica.
 * NO se usa porque MisReservasPage ya muestra toda la info necesaria en el listado.
 * 
 * Información adicional que trae:
 * - Datos completos del recurso asociado
 * - checkins_realizados: contador de check-ins exitosos
 * - capacidad_total del recurso
 * 
 * Usar en futuro para: modal "Ver Detalles", página /reservas/detalle/{id},
 * validación de QR antes de check-in.
 * 
 * ⚠️ NOTA: Endpoint tiene bug en backend (Internal Server Error actual)
 * 
 * @param {string} reservaId - ID de la reserva
 */
export const getReservaById = async (reservaId) => {
    const response = await gateway.get(`/reservas/${reservaId}`);
    return response.data;
};

/**
 * 🔧 NO USADA - Disponible para calendario global
 * 
 * Obtiene TODAS las reservas de una fecha (de todos los usuarios).
 * NO se usa porque la UI actual solo muestra reservas del usuario autenticado.
 * 
 * Diferencia con getDisponibilidadRecurso():
 * - getDisponibilidadRecurso(): horarios libres/ocupados de UN recurso
 * - getReservasPorFecha(): reservas confirmadas de TODOS los recursos
 * 
 * Usar en futuro para: calendario global de ocupación del campus,
 * dashboard admin, reportes de uso diario.
 * 
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} tipoRecurso - Filtrar por tipo (opcional)
 */
export const getReservasPorFecha = async (fecha, tipoRecurso = null) => {
    const params = new URLSearchParams();
    if (tipoRecurso) params.append('tipo_recurso', tipoRecurso);

    const url = `/reservas/fecha/${fecha}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await gateway.get(url);
    return response.data;
};

/**
 * ✅ USADA en MisReservasPage.jsx
 * 
 * Cancelar una reserva existente.
 * Solo el usuario que creó la reserva puede cancelarla (validado por backend).
 * 
 * ⚠️ IMPORTANTE: usuarioId es REQUERIDO como query parameter (no en body).
 * Por qué: Backend valida que el usuario_id de la reserva coincida con el que cancela.
 * 
 * @param {string} reservaId - ID de la reserva a cancelar
 * @param {string} usuarioId - ID del usuario que cancela (requerido, validación de permisos)
 * @param {string} motivo - Motivo de la cancelación (opcional)
 */
export const cancelarReserva = async (reservaId, usuarioId, motivo = '') => {
    const params = new URLSearchParams({
        usuario_id: usuarioId
    });

    if (motivo) {
        params.append('motivo', motivo);
    }

    const response = await gateway.delete(`/reservas/${reservaId}?${params.toString()}`);
    return response.data;
};
