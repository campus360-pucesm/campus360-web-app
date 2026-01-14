import { useState } from "react";
import { Navigation, Check, MapPin, Download } from "lucide-react";
import * as authService from "../../api/services/authService";
import Button from "./Button";
import Alert from "./Alert";
import "../../styles/auth.css";

export default function LocationQRGenerator() {
    const [formData, setFormData] = useState({
        location_code: "",
        location_name: "",
        latitude: null,
        longitude: null,
        class_start: "",
        class_end: "",
        grace_period: 15
    });
    
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [locationCapturing, setLocationCapturing] = useState(false);
    const [createdLocation, setCreatedLocation] = useState(null);
    const [qrImageUrl, setQrImageUrl] = useState(null);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: "", message: "" }), 4000);
    };

    const captureCurrentLocation = () => {
        if (!navigator.geolocation) {
            showAlert("error", "Tu navegador no soporta geolocalización");
            return;
        }

        setLocationCapturing(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setLocationCapturing(false);
                showAlert("success", `Ubicación capturada: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
            },
            (error) => {
                setLocationCapturing(false);
                let errorMessage = "Error al obtener ubicación";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Permiso de ubicación denegado. Por favor, habilita el acceso a la ubicación en tu navegador.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Ubicación no disponible";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Tiempo de espera agotado";
                        break;
                }
                showAlert("error", errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.latitude || !formData.longitude) {
            showAlert("error", "Debes capturar la ubicación antes de generar el QR");
            return;
        }

        if (!formData.class_start || !formData.class_end) {
            showAlert("error", "Debes especificar el horario de la clase");
            return;
        }

        const startDate = new Date(formData.class_start);
        const endDate = new Date(formData.class_end);

        if (endDate <= startDate) {
            showAlert("error", "La hora de fin debe ser posterior a la hora de inicio");
            return;
        }

        try {
            setLoading(true);
            
            // Crear ubicación en el backend
            const location = await authService.generateLocationQRAdvanced({
                location_code: formData.location_code,
                location_name: formData.location_name || null,
                latitude: formData.latitude,
                longitude: formData.longitude,
                class_start: startDate.toISOString(),
                class_end: endDate.toISOString(),
                grace_period: formData.grace_period
            });

            setCreatedLocation(location);
            
            // Obtener imagen del QR
            const blob = await authService.getLocationQRImage(location.id);
            const url = URL.createObjectURL(blob);
            setQrImageUrl(url);

            showAlert("success", "QR con geolocalización generado exitosamente");
        } catch (err) {
            showAlert("error", "Error al generar QR: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!qrImageUrl || !formData.location_code) return;
        const a = document.createElement("a");
        a.href = qrImageUrl;
        a.download = `${formData.location_code}.png`;
        a.click();
    };

    const handleReset = () => {
        setFormData({
            location_code: "",
            location_name: "",
            latitude: null,
            longitude: null,
            class_start: "",
            class_end: "",
            grace_period: 15
        });
        setCreatedLocation(null);
        setQrImageUrl(null);
    };

    return (
        <div className="admin-card">
            <h3 style={{ marginBottom: "6px" }}>Generar QR con Geolocalización y Horario</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
                Crea códigos QR que validan ubicación (100m) y horario de clase para control de asistencia.
            </p>

            <Alert type={alert.type} message={alert.message} />

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Código de ubicación *</label>
                    <input
                        type="text"
                        value={formData.location_code}
                        onChange={(e) => setFormData({ ...formData, location_code: e.target.value })}
                        placeholder="Ej: LAB-101, AULA-302"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Nombre de ubicación (opcional)</label>
                    <input
                        type="text"
                        value={formData.location_name}
                        onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                        placeholder="Laboratorio de Computación 1"
                    />
                </div>

                <div className="form-group">
                    <label>Ubicación GPS *</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            type="button"
                            onClick={captureCurrentLocation}
                            disabled={locationCapturing}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <Navigation size={16} />
                                {locationCapturing ? "Capturando..." : "Capturar Ubicación Actual"}
                            </div>
                        </Button>
                        {formData.latitude && formData.longitude && (
                            <span style={{ fontSize: "12px", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Check size={14} />
                                {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                            </span>
                        )}
                    </div>
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                        Los estudiantes deben estar dentro de 100 metros de esta ubicación para registrar asistencia.
                    </p>
                </div>

                {/* Date Selector */}
                <div className="form-group">
                    <label>Fecha de la clase *</label>
                    <input
                        type="date"
                        value={formData.class_start.split('T')[0] || ''}
                        onChange={(e) => {
                            const date = e.target.value;
                            const startTime = formData.class_start.split('T')[1] || '08:00';
                            const endTime = formData.class_end.split('T')[1] || '10:00';
                            setFormData({
                                ...formData,
                                class_start: `${date}T${startTime}`,
                                class_end: `${date}T${endTime}`
                            });
                        }}
                        required
                        style={{ fontSize: "14px" }}
                    />
                </div>

                {/* Time Selectors */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                        <label>Hora de inicio *</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div>
                                <label style={{ fontSize: "11px", color: "#6b7280" }}>Hora</label>
                                <select
                                    value={formData.class_start.split('T')[1]?.split(':')[0] || '08'}
                                    onChange={(e) => {
                                        const date = formData.class_start.split('T')[0];
                                        const minutes = formData.class_start.split('T')[1]?.split(':')[1] || '00';
                                        setFormData({
                                            ...formData,
                                            class_start: `${date}T${e.target.value}:${minutes}`
                                        });
                                    }}
                                    required
                                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                                >
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={String(i).padStart(2, '0')}>
                                            {String(i).padStart(2, '0')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", color: "#6b7280" }}>Minutos</label>
                                <select
                                    value={formData.class_start.split('T')[1]?.split(':')[1] || '00'}
                                    onChange={(e) => {
                                        const date = formData.class_start.split('T')[0];
                                        const hour = formData.class_start.split('T')[1]?.split(':')[0] || '08';
                                        setFormData({
                                            ...formData,
                                            class_start: `${date}T${hour}:${e.target.value}`
                                        });
                                    }}
                                    required
                                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                                >
                                    {['00', '15', '30', '45'].map(min => (
                                        <option key={min} value={min}>{min}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Hora de fin *</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div>
                                <label style={{ fontSize: "11px", color: "#6b7280" }}>Hora</label>
                                <select
                                    value={formData.class_end.split('T')[1]?.split(':')[0] || '10'}
                                    onChange={(e) => {
                                        const date = formData.class_end.split('T')[0];
                                        const minutes = formData.class_end.split('T')[1]?.split(':')[1] || '00';
                                        setFormData({
                                            ...formData,
                                            class_end: `${date}T${e.target.value}:${minutes}`
                                        });
                                    }}
                                    required
                                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                                >
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={String(i).padStart(2, '0')}>
                                            {String(i).padStart(2, '0')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", color: "#6b7280" }}>Minutos</label>
                                <select
                                    value={formData.class_end.split('T')[1]?.split(':')[1] || '00'}
                                    onChange={(e) => {
                                        const date = formData.class_end.split('T')[0];
                                        const hour = formData.class_end.split('T')[1]?.split(':')[0] || '10';
                                        setFormData({
                                            ...formData,
                                            class_end: `${date}T${hour}:${e.target.value}`
                                        });
                                    }}
                                    required
                                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                                >
                                    {['00', '15', '30', '45'].map(min => (
                                        <option key={min} value={min}>{min}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Período de gracia (minutos)</label>
                    <input
                        type="number"
                        value={formData.grace_period}
                        onChange={(e) => setFormData({ ...formData, grace_period: parseInt(e.target.value) })}
                        min="0"
                        max="60"
                        required
                    />
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                        Tiempo de tolerancia después del inicio de clase para marcar "A tiempo"
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Generando..." : "Generar QR"}
                    </Button>
                    {createdLocation && (
                        <Button type="button" variant="secondary" onClick={handleReset}>
                            Crear Nuevo
                        </Button>
                    )}
                </div>
            </form>

            {qrImageUrl && createdLocation && (
                <div style={{ marginTop: "24px", padding: "20px", background: "#f9fafb", borderRadius: "8px" }}>
                    <h4 style={{ marginBottom: "12px" }}>QR Generado</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "20px", alignItems: "start" }}>
                        <img
                            src={qrImageUrl}
                            alt="QR Code"
                            style={{ maxWidth: "200px", border: "2px solid #e5e7eb", borderRadius: "8px" }}
                        />
                        <div>
                            <p><strong>Código:</strong> {createdLocation.location_code}</p>
                            {createdLocation.location_name && (
                                <p><strong>Nombre:</strong> {createdLocation.location_name}</p>
                            )}
                            <p><strong>Coordenadas:</strong> {createdLocation.latitude.toFixed(6)}, {createdLocation.longitude.toFixed(6)}</p>
                            <p><strong>Inicio:</strong> {new Date(createdLocation.class_start).toLocaleString()}</p>
                            <p><strong>Fin:</strong> {new Date(createdLocation.class_end).toLocaleString()}</p>
                            <p><strong>Gracia:</strong> {createdLocation.grace_period} minutos</p>
                            <div style={{ marginTop: "12px" }}>
                                <Button onClick={handleDownload}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Download size={16} />
                                        Descargar QR
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
