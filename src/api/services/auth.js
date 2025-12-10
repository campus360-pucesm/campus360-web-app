import gateway from '../gateway';

export const login = async (username, password) => {
    // Nota: El endpoint real dependerá de cómo lo defina Auth Service
    // Aquí asumimos /auth/login basado en la descripción
    // Pero el gateway proxy de auth se discutió como /api/v1/auth...
    // Ajustar según la implementación real del Auth Service.
    // En scaffold_campus360.py, auth tiene 'validate', no login explícito en el ejemplo.
    // Pero asumiremos un endpoint estándar.
    const response = await gateway.post('/auth/login', { username, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};
