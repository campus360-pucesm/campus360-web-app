import { useEffect, useState } from 'react';

const IncidentsPage = () => {
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        // Mock data
        setIncidents([
            { id: 101, asunto: 'Wifi lento en Biblioteca', estado: 'Abierto' },
            { id: 102, asunto: 'Aire acondicionado Lab 2', estado: 'Cerrado' },
        ]);
    }, []);

    return (
        <div>
            <h1>Gestión de Incidencias</h1>
            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                            <th>ID</th>
                            <th>Asunto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map(inc => (
                            <tr key={inc.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>#{inc.id}</td>
                                <td style={{ padding: '10px' }}>{inc.asunto}</td>
                                <td style={{ padding: '10px' }}>{inc.estado}</td>
                                <td style={{ padding: '10px' }}>
                                    <button className="btn" style={{ fontSize: '0.8em', padding: '5px 10px' }}>Ver</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentsPage;
