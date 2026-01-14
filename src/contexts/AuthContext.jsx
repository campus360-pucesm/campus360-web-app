import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../api/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage on load
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parsing user data", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const token = response.access_token;
            
            // Store token
            localStorage.setItem('token', token);
            
            // Get user profile
            const userProfile = await authService.getMyProfile();
            localStorage.setItem('user', JSON.stringify(userProfile));
            setUser(userProfile);
            
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Error al iniciar sesión' 
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Compatibility with existing code
    const loginUser = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logoutUser = logout;

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loginUser, 
            logoutUser, 
            loading 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

