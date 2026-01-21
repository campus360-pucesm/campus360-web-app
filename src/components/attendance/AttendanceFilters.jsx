import React from 'react';
import { FileDown } from 'lucide-react';
import './attendance.css';

const AttendanceFilters = ({ locationFilter, setLocationFilter, uniqueLocations, generatePDF }) => {
    return (
        <div className="attendance-filters">
            <div className="filters-row">
                <div className="filter-group">
                    <label>Filtrar por Aula:</label>
                    <select
                        className="filter-select"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn-generate-pdf"
                    onClick={generatePDF}
                >
                    <FileDown size={20} /> Descargar PDF
                </button>
            </div>
        </div>
    );
};

export default AttendanceFilters;
