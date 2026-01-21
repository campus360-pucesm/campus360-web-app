import React from 'react';
import './attendance.css';

const AttendanceTable = ({ filteredLogs }) => {

    const getStatus = (log) => {
        // Default if no location data
        if (!log.locations) {
            return { status: "Registrado", className: "status-badge" };
        }

        const scanTime = new Date(log.timestamp);
        const location = log.locations;
        const gracePeriodMinutes = location.grace_period || 15;

        if (!location.class_start) {
            return { status: "Registrado", className: "status-badge" };
        }

        const classStart = new Date(location.class_start);
        const scanYMD = new Date(scanTime.getFullYear(), scanTime.getMonth(), scanTime.getDate());

        const startDateTime = new Date(classStart);
        startDateTime.setFullYear(scanTime.getFullYear(), scanTime.getMonth(), scanTime.getDate());

        const graceLimit = new Date(startDateTime.getTime() + gracePeriodMinutes * 60000);

        if (scanTime <= startDateTime) {
            return { status: "Puntual", className: "status-badge on-time", icon: "✓" };
        } else if (scanTime <= graceLimit) {
            const delay = Math.round((scanTime - startDateTime) / 60000);
            return { status: `Retraso (${delay} min)`, className: "status-badge late", icon: "⚠" };
        } else {
            return { status: "Ausente", className: "status-badge absent", icon: "✗" };
        }
    };

    return (
        <div className="attendance-table-container">
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th>Ubicación</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((log, idx) => (
                        <tr key={log.id || idx}>
                            <td>
                                <span className="student-name">
                                    {log.users?.full_name || "Usuario Desconocido"}
                                </span>
                            </td>
                            <td>
                                <span className="location-badge">
                                    {log.location_code}
                                </span>
                            </td>
                            <td>
                                {new Date(log.timestamp).toLocaleDateString()}
                            </td>
                            <td>
                                {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td>
                                {(() => {
                                    const { status, className, icon } = getStatus(log);
                                    return (
                                        <span className={className}>
                                            {icon && <span className="status-icon">{icon}</span>}
                                            {status}
                                        </span>
                                    );
                                })()}
                            </td>
                        </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                        <tr>
                            <td colSpan="5">
                                <div className="empty-state">
                                    <div className="empty-state-icon">📋</div>
                                    <div className="empty-state-text">No hay registros para mostrar.</div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
