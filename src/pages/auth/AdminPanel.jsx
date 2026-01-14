import { useEffect, useState } from "react";
import { Users, QrCode, Globe } from "lucide-react";
import "../../styles/auth.css";
import * as authService from "../../api/services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/auth/Button";
import Alert from "../../components/auth/Alert";
import UserManagement from "../../components/auth/UserManagement";
import LocationQRGenerator from "../../components/auth/LocationQRGenerator";

export default function AdminPanel() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users"); // "users", "qr", or "qr-advanced"
    const [locationCode, setLocationCode] = useState("");
    const [locationName, setLocationName] = useState("");
    const [qrBlobUrl, setQrBlobUrl] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/auth/no-access");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: "", message: "" }), 4000);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const generateQR = async (code, name = "") => {
        if (!code) {
            showAlert("error", "El código de ubicación es obligatorio.");
            return;
        }

        try {
            setLoading(true);
            const blob = await authService.generateLocationQR(code, name);
            const url = URL.createObjectURL(blob);
            setQrBlobUrl(url);
            showAlert("success", "QR generado correctamente.");
        } catch (err) {
            showAlert("error", "Error al generar QR: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        generateQR(locationCode, locationName);
    };

    const handleQuickGenerate = (code) => {
        setLocationCode(code);
        setLocationName("");
        generateQR(code, "");
    };

    const handleDownload = () => {
        if (!qrBlobUrl || !locationCode) return;
        const a = document.createElement("a");
        a.href = qrBlobUrl;
        a.download = `${locationCode}.png`;
        a.click();
    };

    if (!user || user.role !== "admin") return null;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Panel de Administración</h2>
                    <p style={{ color: "#6b7280", fontSize: "14px" }}>
                        Gestión completa del sistema CAMPUS360
                    </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/auth/dashboard")}
                    >
                        Mi Dashboard
                    </Button>
                    <Button variant="secondary" onClick={handleLogout}>
                        Cerrar sesión
                    </Button>
                </div>
            </div>

            <Alert type={alert.type} message={alert.message} />

            {/* Tabs */}
            <div style={{ 
                display: "flex", 
                gap: "10px", 
                marginBottom: "24px",
                borderBottom: "2px solid #e5e7eb"
            }}>
                <button
                    className={`tab-button ${activeTab === "users" ? "active" : ""}`}
                    onClick={() => setActiveTab("users")}
                    style={{
                        padding: "12px 24px",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "users" ? "2px solid #667eea" : "2px solid transparent",
                        color: activeTab === "users" ? "#667eea" : "#6b7280",
                        fontWeight: activeTab === "users" ? "600" : "400",
                        cursor: "pointer",
                        marginBottom: "-2px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <Users size={18} />
                    Gestión de Usuarios
                </button>
                <button
                    className={`tab-button ${activeTab === "qr" ? "active" : ""}`}
                    onClick={() => setActiveTab("qr")}
                    style={{
                        padding: "12px 24px",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "qr" ? "2px solid #667eea" : "2px solid transparent",
                        color: activeTab === "qr" ? "#667eea" : "#6b7280",
                        fontWeight: activeTab === "qr" ? "600" : "400",
                        cursor: "pointer",
                        marginBottom: "-2px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <QrCode size={18} />
                    QR Simple
                </button>
                <button
                    className={`tab-button ${activeTab === "qr-advanced" ? "active" : ""}`}
                    onClick={() => setActiveTab("qr-advanced")}
                    style={{
                        padding: "12px 24px",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "qr-advanced" ? "2px solid #667eea" : "2px solid transparent",
                        color: activeTab === "qr-advanced" ? "#667eea" : "#6b7280",
                        fontWeight: activeTab === "qr-advanced" ? "600" : "400",
                        cursor: "pointer",
                        marginBottom: "-2px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <Globe size={18} />
                    QR con Geolocalización
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "users" && <UserManagement />}

            {activeTab === "qr-advanced" && <LocationQRGenerator />}

            {activeTab === "qr" && (
                <>
                    <div className="admin-card" style={{ marginBottom: "24px" }}>
                        <h3 style={{ marginBottom: "6px" }}>Generar QR de ubicación</h3>
                        <p
                            style={{
                                color: "#6b7280",
                                fontSize: "14px",
                                marginBottom: "16px",
                            }}
                        >
                            Crea códigos QR para aulas, laboratorios y otros puntos del campus.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Código de ubicación *</label>
                                <input
                                    type="text"
                                    value={locationCode}
                                    onChange={(e) => setLocationCode(e.target.value)}
                                    placeholder="Ej: LAB-101, AULA-302"
                                />
                            </div>

                            <div className="form-group">
                                <label>Nombre de ubicación (opcional)</label>
                                <input
                                    type="text"
                                    value={locationName}
                                    onChange={(e) => setLocationName(e.target.value)}
                                    placeholder="Laboratorio de Computación 1"
                                />
                            </div>

                            <Button type="submit">
                                {loading ? "Generando..." : "Generar QR"}
                            </Button>
                        </form>

                        {qrBlobUrl && (
                            <div
                                className="qr-preview"
                                style={{ marginTop: "20px", textAlign: "center" }}
                            >
                                <p style={{ marginBottom: "10px" }}>
                                    Código: <strong>{locationCode}</strong>
                                    {locationName ? ` - ${locationName}` : ""}
                                </p>
                                <img
                                    src={qrBlobUrl}
                                    alt="QR ubicación"
                                    style={{ maxWidth: "260px" }}
                                />
                                <div style={{ marginTop: "12px" }}>
                                    <Button onClick={handleDownload}>Descargar QR</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="admin-card">
                        <h3 style={{ marginBottom: "6px" }}>Ubicaciones sugeridas</h3>
                        <p
                            style={{
                                color: "#6b7280",
                                fontSize: "14px",
                                marginBottom: "12px",
                            }}
                        >
                            Genera rápido algunos QR frecuentes del campus.
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                                gap: "10px",
                            }}
                        >
                            {["LAB-101", "LAB-102", "AULA-301", "BIBLIOTECA", "CAFETERIA", "GIMNASIO"].map(
                                (code) => (
                                    <button
                                        key={code}
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={() => handleQuickGenerate(code)}
                                    >
                                        {code}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
