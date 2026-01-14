import { useState } from "react";
import { 
    CheckCircle2, 
    AlertTriangle, 
    XCircle, 
    MapPinOff, 
    Clock, 
    MapPin, 
    Ruler, 
    Globe,
    ChevronDown 
} from "lucide-react";
import "../../styles/auth.css";

const STATUS_COLORS = {
    ON_TIME: "#10b981",
    LATE: "#f59e0b",
    ABSENT: "#ef4444",
    INVALID_LOCATION: "#ef4444",
    EXPIRED: "#6b7280"
};

const STATUS_ICONS = {
    ON_TIME: CheckCircle2,
    LATE: AlertTriangle,
    ABSENT: XCircle,
    INVALID_LOCATION: MapPinOff,
    EXPIRED: Clock
};

const STATUS_LABELS = {
    ON_TIME: "A TIEMPO",
    LATE: "RETRASO",
    ABSENT: "FALTA",
    INVALID_LOCATION: "UBICACIÓN INVÁLIDA",
    EXPIRED: "EXPIRADO"
};

const STATUS_DESCRIPTIONS = {
    ON_TIME: "Llegaste a tiempo dentro del período de gracia establecido.",
    LATE: "Llegaste tarde, después del período de gracia pero antes del fin de clase.",
    ABSENT: "Llegaste después de que terminó la clase, se registra como falta.",
    INVALID_LOCATION: "No estabas dentro del rango de 100 metros del aula al momento del escaneo.",
    EXPIRED: "El código QR ya había expirado (más de 24h después de la clase)."
};

export default function AccessHistory({ history, loading }) {
    const [expandedId, setExpandedId] = useState(null);

    if (loading) {
        return (
            <div className="info-card">
                <p style={{ color: "#6b7280", textAlign: "center" }}>Cargando historial...</p>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="info-card">
                <p style={{ color: "#6b7280" }}>No hay accesos registrados</p>
            </div>
        );
    }

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="info-card">
            <h3>Historial de Accesos</h3>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                Click en cualquier registro para ver información completa
            </p>

            <div style={{ marginTop: "20px" }}>
                {history.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const StatusIcon = item.status ? STATUS_ICONS[item.status] : null;
                    
                    return (
                        <div
                            key={item.id}
                            style={{
                                padding: "16px",
                                background: "var(--light)",
                                borderRadius: "8px",
                                marginBottom: "12px",
                                border: item.status ? `2px solid ${STATUS_COLORS[item.status]}` : "1px solid #e5e7eb",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: isExpanded ? "0 4px 12px rgba(0,0,0,0.1)" : "none"
                            }}
                            onClick={() => toggleExpand(item.id)}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--primary)", fontSize: "18px" }}>
                                            {item.location_code}
                                        </strong>
                                        {item.status && StatusIcon && (
                                            <span style={{
                                                padding: "6px 14px",
                                                borderRadius: "16px",
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                background: STATUS_COLORS[item.status],
                                                color: "white",
                                                letterSpacing: "0.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px"
                                            }}>
                                                <StatusIcon size={16} />
                                                {STATUS_LABELS[item.status]}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#6b7280", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Clock size={14} />
                                        {new Date(item.timestamp).toLocaleString("es-ES", {
                                            dateStyle: "medium",
                                            timeStyle: "short"
                                        })}
                                    </div>
                                </div>
                                <ChevronDown 
                                    size={20}
                                    style={{ 
                                        color: item.status ? STATUS_COLORS[item.status] : "#6b7280",
                                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s ease"
                                    }}
                                />
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div style={{
                                    marginTop: "20px",
                                    paddingTop: "20px",
                                    borderTop: `2px solid ${item.status ? STATUS_COLORS[item.status] : "#e5e7eb"}`,
                                    animation: "slideDown 0.3s ease"
                                }}>
                                    {/* Status Summary */}
                                    {item.status && StatusIcon && (
                                        <div style={{
                                            marginBottom: "20px",
                                            padding: "16px",
                                            background: `linear-gradient(135deg, ${STATUS_COLORS[item.status]}15, ${STATUS_COLORS[item.status]}05)`,
                                            borderRadius: "8px",
                                            borderLeft: `5px solid ${STATUS_COLORS[item.status]}`
                                        }}>
                                            <div style={{ 
                                                fontSize: "16px", 
                                                fontWeight: "700", 
                                                color: STATUS_COLORS[item.status],
                                                marginBottom: "8px",
                                                letterSpacing: "0.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}>
                                                <StatusIcon size={20} />
                                                {STATUS_LABELS[item.status]}
                                            </div>
                                            <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>
                                                {STATUS_DESCRIPTIONS[item.status]}
                                            </div>
                                        </div>
                                    )}

                                    {/* Info Grid */}
                                    <div style={{ 
                                        display: "grid", 
                                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                        gap: "16px" 
                                    }}>
                                        {/* Location */}
                                        <div style={{
                                            padding: "12px",
                                            background: "white",
                                            borderRadius: "6px",
                                            border: "1px solid #e5e7eb"
                                        }}>
                                            <div style={{ 
                                                fontSize: "11px", 
                                                color: "#6b7280", 
                                                marginBottom: "6px",
                                                textTransform: "uppercase",
                                                fontWeight: "600",
                                                letterSpacing: "0.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px"
                                            }}>
                                                <MapPin size={12} />
                                                Ubicación
                                            </div>
                                            <div style={{ fontSize: "15px", fontWeight: "600", color: "#111827" }}>
                                                {item.location_code}
                                            </div>
                                        </div>

                                        {/* Distance */}
                                        {item.distance_meters !== null && item.distance_meters !== undefined && (
                                            <div style={{
                                                padding: "12px",
                                                background: "white",
                                                borderRadius: "6px",
                                                border: "1px solid #e5e7eb"
                                            }}>
                                                <div style={{ 
                                                    fontSize: "11px", 
                                                    color: "#6b7280", 
                                                    marginBottom: "6px",
                                                    textTransform: "uppercase",
                                                    fontWeight: "600",
                                                    letterSpacing: "0.5px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px"
                                                }}>
                                                    <Ruler size={12} />
                                                    Distancia
                                                </div>
                                                <div style={{ fontSize: "15px", fontWeight: "600", color: "#111827" }}>
                                                    {Math.round(item.distance_meters)} metros
                                                </div>
                                                <div style={{ fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                                                    {item.distance_meters <= 100 ? 
                                                        <>
                                                            <CheckCircle2 size={14} color="#10b981" />
                                                            <span style={{ color: "#10b981", fontWeight: "600" }}>Dentro del rango</span>
                                                        </> :
                                                        <>
                                                            <XCircle size={14} color="#ef4444" />
                                                            <span style={{ color: "#ef4444", fontWeight: "600" }}>Fuera del rango</span>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        )}

                                        {/* Time */}
                                        <div style={{
                                            padding: "12px",
                                            background: "white",
                                            borderRadius: "6px",
                                            border: "1px solid #e5e7eb"
                                        }}>
                                            <div style={{ 
                                                fontSize: "11px", 
                                                color: "#6b7280", 
                                                marginBottom: "6px",
                                                textTransform: "uppercase",
                                                fontWeight: "600",
                                                letterSpacing: "0.5px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px"
                                            }}>
                                                <Clock size={12} />
                                                Hora de Escaneo
                                            </div>
                                            <div style={{ fontSize: "15px", fontWeight: "600", color: "#111827" }}>
                                                {new Date(item.timestamp).toLocaleTimeString("es-ES", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit"
                                                })}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                                                {new Date(item.timestamp).toLocaleDateString("es-ES", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </div>
                                        </div>

                                        {/* Coordinates */}
                                        {item.user_latitude && item.user_longitude && (
                                            <div style={{
                                                padding: "12px",
                                                background: "white",
                                                borderRadius: "6px",
                                                border: "1px solid #e5e7eb",
                                                gridColumn: "1 / -1"
                                            }}>
                                                <div style={{ 
                                                    fontSize: "11px", 
                                                    color: "#6b7280", 
                                                    marginBottom: "6px",
                                                    textTransform: "uppercase",
                                                    fontWeight: "600",
                                                    letterSpacing: "0.5px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px"
                                                }}>
                                                    <Globe size={12} />
                                                    Coordenadas GPS del Escaneo
                                                </div>
                                                <div style={{ 
                                                    fontSize: "14px", 
                                                    fontFamily: "monospace", 
                                                    color: "#111827",
                                                    fontWeight: "500"
                                                }}>
                                                    Latitud: {item.user_latitude.toFixed(6)} | Longitud: {item.user_longitude.toFixed(6)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Info */}
                                    <div style={{
                                        marginTop: "16px",
                                        padding: "12px",
                                        background: "#f9fafb",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        color: "#6b7280"
                                    }}>
                                        <strong>ID del Registro:</strong> #{item.id} | 
                                        <strong> Usuario:</strong> {item.user_id}
                                        {item.location_id && <span> | <strong>ID Ubicación:</strong> {item.location_id}</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
