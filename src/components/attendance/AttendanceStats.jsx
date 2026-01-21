import React from 'react';
import './attendance.css';

const AttendanceStats = ({ stats }) => {
    return (
        <div className="stats-grid">
            <div className="stat-card stat-primary">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Asistencias</div>
            </div>
            <div className="stat-card stat-success">
                <div className="stat-value">{stats.today}</div>
                <div className="stat-label">Asistencias Hoy</div>
            </div>
            <div className="stat-card stat-info">
                <div className="stat-value">{stats.punctuality}</div>
                <div className="stat-label">Puntualidad Promedio</div>
            </div>
        </div>
    );
};

export default AttendanceStats;
