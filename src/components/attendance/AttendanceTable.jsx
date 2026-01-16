import React from 'react';

const AttendanceTable = ({ filteredLogs }) => {

    const getStatus = (log) => {
        // Default if no location data
        if (!log.locations) {
            return { status: "Registrado", colorClass: "bg-gray-100 text-gray-800" };
        }

        const scanTime = new Date(log.timestamp);
        const location = log.locations;
        const gracePeriodMinutes = location.grace_period || 15;

        // Parse class start/end times
        // Note: location.class_start might be a full timestamp or time string depending on DB
        // Assuming it's a timestamp for the specific class instance or we need to extract time
        // If it's just a time (HH:MM:SS), we need to combine with scan date

        // Robust parsing: Check if class_start exists
        if (!location.class_start) {
            return { status: "Registrado", colorClass: "bg-gray-100 text-gray-800" };
        }

        const classStart = new Date(location.class_start);

        // Normalize dates to compare only times if needed, BUT:
        // If class_start is a specific datetime from the DB schedule for TODAY, we compare directly.
        // If it's a generic "08:00 AM", we'd need to set year/month/day from scanTime.
        // Given earlier context, it seems to be specific timestamps or the user implies standard slots.
        // Let's assume we need to sync the Date part if the years differ significantly (e.g. 1970), 
        // but user says "class_start timestamp" in DB screenshot. Let's try direct comparison first, 
        // but usually schedule is generic. To be safe, let's normalize to Scan Date's YMD.

        const scanYMD = new Date(scanTime.getFullYear(), scanTime.getMonth(), scanTime.getDate());

        const startDateTime = new Date(classStart);
        startDateTime.setFullYear(scanTime.getFullYear(), scanTime.getMonth(), scanTime.getDate());

        const graceLimit = new Date(startDateTime.getTime() + gracePeriodMinutes * 60000);

        if (scanTime <= startDateTime) {
            return { status: "Puntual", colorClass: "bg-green-100 text-green-800" };
        } else if (scanTime <= graceLimit) {
            const delay = Math.round((scanTime - startDateTime) / 60000);
            return { status: `Retraso (${delay} min)`, colorClass: "bg-yellow-100 text-yellow-800" };
        } else {
            return { status: "Ausente", colorClass: "bg-red-100 text-red-800" };
        }
    };

    return (
        <div className="bg-white shadow-md overflow-hidden border border-gray-100">
            <div className="overflow-x-auto p-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="pl-10 pr-6 py-5 text-left text-sm font-extrabold text-gray-700">Estudiante</th>
                            <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700">Ubicación</th>
                            <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700">Fecha</th>
                            <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700">Hora</th>
                            <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLogs.map((log, idx) => (
                            <tr key={log.id || idx}>
                                <td className="pl-10 pr-6 py-5 whitespace-nowrap">
                                    <div className="text-gray-900 text-base">
                                        {log.users?.full_name || "Usuario Desconocido"}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                                        {log.location_code}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                    {new Date(log.timestamp).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    {(() => {
                                        const { status, colorClass } = getStatus(log);
                                        return (
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${colorClass}`}>
                                                {status}
                                            </span>
                                        );
                                    })()}
                                </td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                    No hay registros para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;
