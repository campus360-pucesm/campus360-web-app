import { useEffect, useState } from "react";
import { IdCard, Camera, QrCode, History } from "lucide-react";
import "../../styles/auth.css";
import * as authService from "../../api/services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/auth/Button";
import Alert from "../../components/auth/Alert";
import CredentialCard from "../../components/auth/CredentialCard";
import QRScanner from "../../components/auth/QRScanner";
import QRScannerAdvanced from "../../components/auth/QRScannerAdvanced";
import AccessHistory from "../../components/auth/AccessHistory";
import LocationQRGenerator from "../../components/auth/LocationQRGenerator";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("credential");
    const [qrImageUrl, setQrImageUrl] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [generatingQR, setGeneratingQR] = useState(false);
    
    // For teacher location QR generation
    const [locationCode, setLocationCode] = useState("");
    const [locationName, setLocationName] = useState("");
    const [locationQrUrl, setLocationQrUrl] = useState(null);
    const [loadingLocationQR, setLoadingLocationQR] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            loadHistory();
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

    const loadHistory = async () => {
        try {
            setLoadingHistory(true);
            const data = await authService.getAccessHistory(10);
            setHistory(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const generateCredential = async () => {
        try {
            setGeneratingQR(true);
            const blob = await authService.generateUserCredentialQR(user.id);
            const url = URL.createObjectURL(blob);
            setQrImageUrl(url);
            showAlert("success", "Credencial generada correctamente.");
        } catch (err) {
            showAlert("error", "Error al generar la credencial: " + err.message);
        } finally {
            setGeneratingQR(false);
        }
    };

    const handleScanLocation = async (locationCode) => {
        try {
            const data = await authService.scanLocation(locationCode);
            showAlert("success", `Acceso registrado en ${data.location_code}`);
            loadHistory();
        } catch (err) {
            showAlert("error", "Error al registrar acceso: " + err.message);
        }
    };

    const generateLocationQR = async (e) => {
        e.preventDefault();
        if (!locationCode) {
            showAlert("error", "El código de ubicación es obligatorio");
            return;
        }

        try {
            setLoadingLocationQR(true);
            const blob = await authService.generateLocationQR(locationCode, locationName);
            const url = URL.createObjectURL(blob);
            setLocationQrUrl(url);
            showAlert("success", "QR de ubicación generado correctamente");
        } catch (err) {
            showAlert("error", "Error al generar QR: " + err.message);
        } finally {
            setLoadingLocationQR(false);
        }
    };

    const downloadLocationQR = () => {
        if (!locationQrUrl || !locationCode) return;
        const a = document.createElement("a");
        a.href = locationQrUrl;
        a.download = `${locationCode}.png`;
        a.click();
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case "admin": return "Administrador";
            case "teacher": return "Profesor";
            case "student": return "Estudiante";
            default: return role;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "admin": return "#dc2626";
            case "teacher": return "#2563eb";
            case "student": return "#16a34a";
            default: return "#6b7280";
        }
    };

    if (!user) return null;

    const isTeacherOrAdmin = user.role === "admin" || user.role === "teacher";
    const isStudent = user.role === "student";

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>{user.full_name}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                        <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>{user.email}</p>
                        <span style={{
                            background: getRoleBadgeColor(user.role),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "500"
                        }}>
                            {getRoleLabel(user.role)}
                        </span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    {user.role === "admin" && (
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/auth/admin")}
                        >
                            Panel Admin
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleLogout}>
                        Cerrar sesión
                    </Button>
                </div>
            </div>

            <Alert type={alert.type} message={alert.message} />

            {/* TABS */}
            <div className="tabs">
                <button
                    className={`tab-button ${
                        activeTab === "credential" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("credential")}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <IdCard size={18} />
                        Credencial
                    </div>
                </button>
                
                {isStudent && (
                    <button
                        className={`tab-button ${activeTab === "scan" ? "active" : ""}`}
                        onClick={() => setActiveTab("scan")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Camera size={18} />
                            Escanear
                        </div>
                    </button>
                )}
                
                {isTeacherOrAdmin && (
                    <button
                        className={`tab-button ${activeTab === "generate-qr" ? "active" : ""}`}
                        onClick={() => setActiveTab("generate-qr")}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <QrCode size={18} />
                            Generar QR
                        </div>
                    </button>
                )}
                
                <button
                    className={`tab-button ${
                        activeTab === "history" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("history")}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <History size={18} />
                        Historial
                    </div>
                </button>
            </div>

            <div className="tab-content" style={{ marginTop: "-1px" }}>
                {activeTab === "credential" && (
                    <div>
                        {!qrImageUrl && (
                            <div style={{ marginBottom: "20px" }}>
                                <div className="dashboard-section-title">
                                    Mi credencial digital
                                </div>
                                <p className="dashboard-section-subtitle">
                                    Genera tu carnet digital con código QR para identificarte en
                                    el campus.
                                </p>
                                <Button onClick={generateCredential}>
                                    {generatingQR ? "Generando..." : "✨ Generar credencial"}
                                </Button>
                            </div>
                        )}

                        <CredentialCard user={user} qrImageUrl={qrImageUrl} />
                    </div>
                )}

                {activeTab === "scan" && isStudent && (
                    <QRScannerAdvanced />
                )}

                {activeTab === "generate-qr" && isTeacherOrAdmin && (
                    <LocationQRGenerator />
                )}

                {activeTab === "history" && (
                    <AccessHistory history={history} loading={loadingHistory} />
                )}
            </div>
        </div>
    );
}
