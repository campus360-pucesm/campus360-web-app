import gateway from '../gateway';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

// Login
export const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await gateway.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// QR Access - Get current user profile
export const getMyProfile = async () => {
    const response = await gateway.get('/auth/qr/me');
    return response.data;
};

// QR Access - Scan location
export const scanLocation = async (locationCode) => {
    const response = await gateway.post('/auth/qr/scan', { location_code: locationCode });
    return response.data;
};

// QR Access - Get access history
export const getAccessHistory = async (limit = 10) => {
    const response = await gateway.get(`/auth/qr/history?limit=${limit}`);
    return response.data;
};

// Admin - Get all users
export const getUsers = async (skip = 0, limit = 100, role = null) => {
    let url = `/auth/admin/users?skip=${skip}&limit=${limit}`;
    if (role) {
        url += `&role=${role}`;
    }
    const response = await gateway.get(url);
    return response.data;
};

// Admin - Get user by ID
export const getUserById = async (userId) => {
    const response = await gateway.get(`/auth/admin/users/${userId}`);
    return response.data;
};

// Admin - Create user
export const createUser = async (userData) => {
    const response = await gateway.post('/auth/admin/users', userData);
    return response.data;
};

// Admin - Update user
export const updateUser = async (userId, userData) => {
    const response = await gateway.put(`/auth/admin/users/${userId}`, userData);
    return response.data;
};

// Admin - Delete user
export const deleteUser = async (userId) => {
    const response = await gateway.delete(`/auth/admin/users/${userId}`);
    return response.data;
};

// Admin - Get stats
export const getAdminStats = async () => {
    const response = await gateway.get('/auth/admin/stats');
    return response.data;
};

// Admin - Get recent access
export const getRecentAccess = async () => {
    const response = await gateway.get('/auth/admin/recent-access');
    return response.data;
};

// Admin - Generate location QR
export const generateLocationQR = async (locationCode, locationName = '') => {
    const response = await gateway.post('/auth/admin/qr/generate-location', {
        location_code: locationCode,
        location_name: locationName
    }, {
        responseType: 'blob'
    });
    return response.data;
};

// Admin - Generate user credential QR
export const generateUserCredentialQR = async (userId) => {
    const response = await gateway.get(`/auth/admin/qr/generate-credential/${userId}`, {
        responseType: 'blob'
    });
    return response.data;
};

// Admin - Generate location QR with geolocation (Advanced)
export const generateLocationQRAdvanced = async (locationData) => {
    const response = await gateway.post('/auth/admin/qr/generate-location-advanced', locationData);
    return response.data; // Returns location object with ID
};

// Admin - Get location QR image
export const getLocationQRImage = async (locationId) => {
    const response = await gateway.get(`/auth/admin/qr/location/${locationId}/image`, {
        responseType: 'blob'
    });
    return response.data;
};

// QR Access - Scan location with geolocation validation (Advanced)
export const scanLocationAdvanced = async (scanData) => {
    const response = await gateway.post('/auth/qr/scan-advanced', scanData);
    return response.data;
};

// Admin - Get all locations
export const getLocations = async () => {
    const response = await gateway.get('/auth/admin/locations');
    return response.data;
};

// Admin - Get location by ID
export const getLocationById = async (locationId) => {
    const response = await gateway.get(`/auth/admin/locations/${locationId}`);
    return response.data;
};

export default {
    login,
    logout,
    getMyProfile,
    scanLocation,
    getAccessHistory,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAdminStats,
    getRecentAccess,
    generateLocationQR,
    generateUserCredentialQR,
    generateLocationQRAdvanced,
    getLocationQRImage,
    scanLocationAdvanced,
    getLocations,
    getLocationById
};

