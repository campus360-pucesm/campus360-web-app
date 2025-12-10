import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../api/services/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Simulator: Auth service mock currently doesn't implement real login POST
            // But we will simulate a successful response if the call works or fails gracefully for demo
            // In real integration, we await login(username, password)

            // For demo scaffolding purposes, assuming login returns { valid: true, user_id: 1, token: "..." }
            // If backend is not running, we act as a "mock" mode if special credentials used? No, keep it clean.

            // Let's try the real call
            // const data = await login(username, password);

            // Mocking for scaffold robustness until backend is fully up with CORS etc.
            // If username is "admin"
            const mockToken = "mock-jwt-token-123";
            const mockUser = { name: username, id: 1 };

            loginUser(mockUser, mockToken);
            navigate('/');

        } catch (err) {
            setError(err.response?.data?.detail || 'Error al iniciar sesión');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e9ecef' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Campus360 Login</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ingresar</button>
                    <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                        (Nota: Este es un frontend scaffold. La autenticación real verificará contra Auth-Service)
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
