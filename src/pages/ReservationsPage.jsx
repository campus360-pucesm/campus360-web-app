import { useEffect, useState } from 'react';
import { getReservas } from '../api/services/reservas';

const ReservationsPage = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Try to fetch real data
                // const data = await getReservas();
                // setReservas(data);

                // Mock data for scaffold visualization
                setReservas([
                    { id: 1, recurso: 'Aula 101', fecha: '2025-12-10', estado: 'Confirmada' },
                    { id: 2, recurso: 'Proyector B', fecha: '2025-12-12', estado: 'Pendiente' },
                ]);
            } catch (error) {
                console.error("Error loading reservas", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <h1>Mis Reservas</h1>
            <button className="btn btn-primary" style={{ marginBottom: '20px' }}>
                + Nueva Reserva
            </button>

            {loading ? <p>Cargando...</p> : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {reservas.map(reserva => (
                        <div key={reserva.id} className="card">
                            <h3>{reserva.recurso}</h3>
                            <p>Fecha: {reserva.fecha}</p>
                            <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                background: reserva.estado === 'Confirmada' ? '#d4edda' : '#fff3cd',
                                color: reserva.estado === 'Confirmada' ? '#155724' : '#856404'
                            }}>
                                {reserva.estado}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;
