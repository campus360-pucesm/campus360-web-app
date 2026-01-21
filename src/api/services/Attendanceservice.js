import gateway from '../gateway';

/**
 * Attendance Service
 * Handles all attendance-related API calls
 * 
 * Ubicación: src/api/services/attendanceService.js
 */

/**
 * Obtener todos los reportes de asistencia
 * Usado por Reports.jsx
 */
export const getReports = async () => {
    try {
        const response = await gateway.get('/attendance/reports');
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance reports:', error);
        // Retornar datos mock si el backend no está disponible
        return getMockData();
    }
};

/**
 * Obtener historial de asistencia con filtros
 */
export const getAttendanceHistory = async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.userId) params.append('user_id', filters.userId);
    if (filters.locationCode) params.append('location_code', filters.locationCode);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await gateway.get(`/attendance/history?${params.toString()}`);
    return response.data;
};

/**
 * Registrar asistencia (check-in)
 */
export const registerAttendance = async (data) => {
    const response = await gateway.post('/attendance/register', data);
    return response.data;
};

/**
 * Obtener estadísticas de asistencia
 */
export const getAttendanceStats = async (userId = null) => {
    const url = userId 
        ? `/attendance/stats?user_id=${userId}` 
        : '/attendance/stats';
    const response = await gateway.get(url);
    return response.data;
};

/**
 * Datos mock para desarrollo/testing
 * Se usa cuando el backend de asistencia no está disponible
 */
const getMockData = () => {
    const today = new Date();
    const mockLogs = [
        {
            id: 1,
            timestamp: today.toISOString(),
            location_code: 'LAB-101',
            users: { full_name: 'Juan Pérez' },
            locations: { 
                class_start: new Date(today.setHours(8, 0, 0)).toISOString(),
                grace_period: 15 
            }
        },
        {
            id: 2,
            timestamp: new Date(today.setHours(8, 5, 0)).toISOString(),
            location_code: 'LAB-101',
            users: { full_name: 'María García' },
            locations: { 
                class_start: new Date(today.setHours(8, 0, 0)).toISOString(),
                grace_period: 15 
            }
        },
        {
            id: 3,
            timestamp: new Date(today.setHours(9, 0, 0)).toISOString(),
            location_code: 'AULA-302',
            users: { full_name: 'Carlos López' },
            locations: { 
                class_start: new Date(today.setHours(9, 0, 0)).toISOString(),
                grace_period: 15 
            }
        },
        {
            id: 4,
            timestamp: new Date(today.setHours(8, 20, 0)).toISOString(),
            location_code: 'LAB-102',
            users: { full_name: 'Ana Martínez' },
            locations: { 
                class_start: new Date(today.setHours(8, 0, 0)).toISOString(),
                grace_period: 15 
            }
        },
        {
            id: 5,
            timestamp: new Date(today.setHours(10, 0, 0)).toISOString(),
            location_code: 'BIBLIOTECA',
            users: { full_name: 'Pedro Sánchez' },
            locations: null
        }
    ];
    
    return mockLogs;
};

export default {
    getReports,
    getAttendanceHistory,
    registerAttendance,
    getAttendanceStats
};