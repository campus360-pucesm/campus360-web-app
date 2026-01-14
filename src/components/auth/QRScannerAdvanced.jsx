import { useEffect, useRef, useState } from "react";
import { Camera, X, Info, CheckCircle2, AlertTriangle, XCircle, MapPinOff, Clock } from "lucide-react";
import * as authService from "../../api/services/authService";
import Button from "./Button";
import "../../styles/auth.css";

const STATUS_COLORS = {
    ON_TIME: "#10b981",
    LATE: "#f59e0b",
    ABSENT: "#ef4444",
    INVALID_LOCATION: "#ef4444",
    EXPIRED: "#6b7280"
};

const STATUS_LABELS = {
    ON_TIME: "A tiempo",
    LATE: "Retraso",
    ABSENT: "Falta",
    INVALID_LOCATION: "Ubicación inválida",
    EXPIRED: "QR expirado"
};

export default function QRScannerAdvanced() {
    const [isScanning, setIsScanning] = useState(false);
    const [status, setStatus] = useState("Inactivo");
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const qrRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    useEffect(() => {
        return () => {
            stopScanner();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocalización no soportada"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    let errorMessage = "Error al obtener ubicación";
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "Permiso de ubicación denegado";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Ubicación no disponible";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "Tiempo de espera agotado";
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    };

    const handleQRDetected = async (locationId) => {
        try {
            setStatus("Obteniendo tu ubicación...");
            
            // Get user's current location
            const userLocation = await getUserLocation();
            
            setStatus("Validando asistencia...");
            
            // Scan with geolocation validation
            const result = await authService.scanLocationAdvanced({
                location_id: locationId,
                user_latitude: userLocation.latitude,
                user_longitude: userLocation.longitude
            });
            
            setScanResult(result);
            setError(null);
            setStatus("Escaneo completado");
            
        } catch (err) {
            console.error("Error processing scan:", err);
            setError(err.response?.data?.detail || err.message);
            setStatus("Error en el escaneo");
        }
    };

    const startScanner = async () => {
        if (isScanning) return;

        if (!window.Html5Qrcode) {
            setStatus("Librería de escaneo no disponible");
            return;
        }

        // Reset previous results
        setScanResult(null);
        setError(null);

        try {
            html5QrCodeRef.current = new window.Html5Qrcode("qr-reader-advanced");
            setStatus("Activando cámara...");

            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                async (decodedText) => {
                    setStatus(`QR detectado: ${decodedText.substring(0, 20)}...`);
                    await stopScanner();
                    await handleQRDetected(decodedText);
                },
                () => {
                    // Ignore scan errors
                }
            );

            setIsScanning(true);
            setStatus("Cámara activa, escanea un QR de ubicación");

        } catch (err) {
            console.error(err);
            setStatus("Error al iniciar la cámara. Verifica permisos.");
            await stopScanner();
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                await html5QrCodeRef.current.clear();
            } catch (err) {
                console.error("Error stopping scanner", err);
            }
        }
        html5QrCodeRef.current = null;
        setIsScanning(false);
    };

    const handleReset = () => {
        setScanResult(null);
        setError(null);
        setStatus("Inactivo");
    };

    return (
        <div>
            <div className="dashboard-section-title">Escanear QR con Validación</div>
            <p className="dashboard-section-subtitle">
                Escanea el QR de la ubicación para registrar tu asistencia. Se validará tu ubicación y horario.
            </p>

            {/* Scan Result Display */}
            {scanResult && (
                <div style={{
                    padding: "16px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    background: STATUS_COLORS[scanResult.status] + "15",
                    border: `2px solid ${STATUS_COLORS[scanResult.status]}`
                }}>
                    <div style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: STATUS_COLORS[scanResult.status],
                        marginBottom: "8px"
                    }}>
                        {STATUS_LABELS[scanResult.status]}
                    </div>
                    <div style={{ fontSize: "14px", color: "#374151" }}>
                        <p><strong>Ubicación:</strong> {scanResult.location_code} {scanResult.location_name && `- ${scanResult.location_name}`}</p>
                        <p><strong>Distancia:</strong> {scanResult.distance_meters}m del aula</p>
                        <p><strong>Hora:</strong> {new Date(scanResult.timestamp).toLocaleString()}</p>
                        <p style={{ marginTop: "8px", fontStyle: "italic" }}>{scanResult.message}</p>
                    </div>
                    <Button 
                        variant="secondary" 
                        onClick={handleReset}
                        style={{ marginTop: "12px" }}
                    >
                        Escanear Otro QR
                    </Button>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div style={{
                    padding: "16px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    background: "#fef2f2",
                    border: "2px solid #ef4444",
                    color: "#991b1b"
                }}>
                    <strong>Error:</strong> {error}
                    <Button 
                        variant="secondary" 
                        onClick={handleReset}
                        style={{ marginTop: "12px" }}
                    >
                        Intentar de Nuevo
                    </Button>
                </div>
            )}

            {/* QR Scanner */}
            {!scanResult && !error && (
                <>
                    <div className="qr-reader-container">
                        <div
                            id="qr-reader-advanced"
                            ref={qrRef}
                            style={{ width: "100%", minHeight: "260px" }}
                        ></div>
                    </div>

                    <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
                        {!isScanning ? (
                            <Button onClick={startScanner}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Camera size={16} />
                                    Abrir cámara
                                </div>
                            </Button>
                        ) : (
                            <Button variant="secondary" onClick={stopScanner}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <X size={16} />
                                    Detener cámara
                                </div>
                            </Button>
                        )}
                    </div>

                    <p style={{
                        marginTop: "10px",
                        fontSize: "13px",
                        color: "#6b7280",
                    }}>
                        Estado: {status}
                    </p>
                </>
            )}

            {/* Info Box */}
            <div style={{
                marginTop: "16px",
                padding: "12px",
                background: "#f3f4f6",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#6b7280"
            }}>
                <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Info size={14} />
                    Información:
                </strong>
                <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    <li>Debes estar dentro de 100m del aula</li>
                    <li>Se requiere permiso de ubicación y cámara</li>
                    <li>El estado se determina según el horario de clase</li>
                </ul>
            </div>
        </div>
    );
}
