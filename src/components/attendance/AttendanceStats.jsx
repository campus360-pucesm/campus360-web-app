import React from 'react';

const AttendanceStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-indigo-500 flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-gray-500 font-medium mt-3 text-lg">Total Asistencias</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-emerald-500 flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-emerald-600">{stats.today}</div>
                <div className="text-gray-500 font-medium mt-3 text-lg">Asistencias Hoy</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-indigo-400 flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-indigo-600">{stats.punctuality}</div>
                <div className="text-gray-500 font-medium mt-3 text-lg">Puntualidad Promedio</div>
            </div>
        </div>
    );
};

export default AttendanceStats;
