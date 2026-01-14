import { useState } from "react";
import "../../styles/auth.css";
import Input from "../../components/auth/Input";
import Button from "../../components/auth/Button";
import Alert from "../../components/auth/Alert";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const result = await login(email, password);
            
            if (result.success) {
                // Get user from localStorage to check role
                const userData = JSON.parse(localStorage.getItem('user'));
                
                if (userData.role === "admin") {
                    navigate("/auth/admin");
                } else {
                    navigate("/auth/dashboard");
                }
            } else {
                setErrorMsg(result.error);
            }
        } catch (err) {
            setErrorMsg(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="center-container">
            <div className="card">
                <div className="app-title">
                    <h1>CAMPUS360</h1>
                    <p>Autenticación Inteligente</p>
                </div>

                <Alert type="error" message={errorMsg} />

                <form onSubmit={handleLogin}>
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        placeholder="usuario@mail.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? "Ingresando..." : "Ingresar"}
                    </Button>
                </form>

                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
                    <p>¿No tienes cuenta? Contacta al administrador</p>
                </div>
            </div>
        </div>
    );
}
