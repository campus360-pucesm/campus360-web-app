import React, { useState } from 'react';
import Reports from '../components/attendance/Reports';

const AttendancePage = () => {
    return (
        <div className="p-8">
            {/* Header */}
            <div style={{ marginBottom: '4rem' }} className="pb-4 border-b border-gray-200"> {/* Explicit style + border for visual separation */}
                <h1 className="text-3xl font-bold text-gray-800">Reporte de Asistencias</h1>
            </div>

            {/* Content Area - Just Reports */}
            <div className="min-h-[400px] mt-12"> {/* Added mt-12 */}
                <Reports />
            </div>
        </div>
    );
};

export default AttendancePage;
