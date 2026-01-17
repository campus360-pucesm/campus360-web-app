import React from 'react';
import { FileDown } from 'lucide-react';

const AttendanceFilters = ({ locationFilter, setLocationFilter, uniqueLocations, generatePDF }) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="font-bold text-gray-700 whitespace-nowrap text-lg">Filtrar por Aula:</label>
                <div className="relative flex-1">
                    <select
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 text-base"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition font-bold text-base shadow-sm"
                    onClick={generatePDF}
                >
                    <FileDown size={20} /> Descargar PDF
                </button>
            </div>
        </div>
    );
};

export default AttendanceFilters;
