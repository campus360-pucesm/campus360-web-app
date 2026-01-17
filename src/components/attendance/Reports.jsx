import React, { useEffect, useState } from 'react';
import { getReports } from '../../api/services/attendanceService';
import { Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AttendanceStats from './AttendanceStats';
import AttendanceFilters from './AttendanceFilters';
import AttendanceTable from './AttendanceTable';

const Reports = () => {
    const [allLogs, setAllLogs] = useState([]); // Store all logs
    const [filteredLogs, setFilteredLogs] = useState([]); // Store filtered
    const [loading, setLoading] = useState(true);
    const [locationFilter, setLocationFilter] = useState('TODOS');

    // Stats state
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        punctuality: '0%'
    });

    useEffect(() => {
        fetchReports();
    }, []);

    // Re-filter when logs or filter changes
    useEffect(() => {
        filterData();
    }, [allLogs, locationFilter]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await getReports();
            setAllLogs(data || []);
        } catch (err) {
            console.error(err);
            setAllLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let result = allLogs;

        // Filter by Location
        if (locationFilter !== 'TODOS') {
            result = result.filter(log => log.location_code === locationFilter);
        }

        setFilteredLogs(result);

        // Update Stats based on result
        if (result.length > 0) {
            const todayStr = new Date().toDateString();
            const todayCount = result.filter(log => new Date(log.timestamp).toDateString() === todayStr).length;

            // Calculate pseudo punctuality for demo
            setStats({
                total: result.length,
                today: todayCount,
                punctuality: '95%' // Mock for now
            });
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text('Reporte de Asistencia - Campus360', 14, 22);
        doc.setFontSize(11);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

        // Data processing for table
        const tableColumn = ["Estudiante", "Ubicación", "Fecha", "Hora", "Estado"];
        const tableRows = [];

        filteredLogs.forEach(log => {
            const date = new Date(log.timestamp);
            const statusText = "Registrado";

            const rowData = [
                log.users?.full_name || "Usuario Desconocido",
                log.location_code,
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                statusText
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.save(`Reporte_Asistencia_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    // Get unique locations for dropdown
    const uniqueLocations = ['TODOS', ...new Set(allLogs.map(log => log.location_code))];

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col gap-12">
            <AttendanceStats stats={stats} />

            <AttendanceFilters
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                uniqueLocations={uniqueLocations}
                generatePDF={generatePDF}
            />

            <AttendanceTable filteredLogs={filteredLogs} />
        </div>
    );
};

export default Reports;
