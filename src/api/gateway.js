import axios from 'axios';

// URL del API Gateway o backend directo
// Para desarrollo: usar directamente el puerto del backend de reservas (8001)
// Para producción: usar el API Gateway (8000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const gateway = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token JWT
gateway.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores (ej. 401 Unauthorized)
gateway.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si el token expiró o es inválido, cerrar sesión
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default gateway;
