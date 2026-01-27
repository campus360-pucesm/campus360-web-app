import { useState } from 'react';
import styles from '../../styles/Incidencias.module.css';
import TicketFilters from './TicketFilters';
import TicketCard from './TicketCard';
import { getTickets } from '../../api/incidenciasService';

/**
 * Sección de lista de tickets
 */
const TicketsListSection = ({ onShowToast, onViewTicket }) => {
    const [tickets, setTickets] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        offset: 0,
        limit: 10,
        has_more: false
    });

    const handleFilter = async (filters) => {
        try {
            const response = await getTickets(filters);
            setTickets(response.incidencias || []);
            setPagination({
                total: response.total,
                offset: response.offset,
                limit: response.limit,
                has_more: response.has_more
            });
            onShowToast(`${response.incidencias.length} tickets encontrados`, 'success');
        } catch (error) {
            onShowToast('Error al cargar tickets', 'error');
            setTickets([]);
        }
    };

    const handleNextPage = () => {
        const newOffset = pagination.offset + pagination.limit;
        handleFilter({ offset: newOffset, limit: pagination.limit });
    };

    return (
        <div>
            <h2>Lista de Tickets</h2>
            <TicketFilters onFilter={handleFilter} />
            
            <div className={styles.ticketsContainer}>
                {tickets.length === 0 ? (
                    <div className={styles.emptyState}>No hay tickets que mostrar</div>
                ) : (
                    tickets.map(ticket => (
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            onClick={onViewTicket}
                        />
                    ))
                )}
            </div>

            {tickets.length > 0 && (
                <div className={styles.paginationInfo}>
                    Mostrando {tickets.length} de {pagination.total} tickets
                    {' | '}Página {Math.floor(pagination.offset / pagination.limit) + 1}
                    {pagination.has_more && (
                        <>
                            {' | '}
                            <button
                                className={`${styles.btn} ${styles.btnSecondary}`}
                                onClick={handleNextPage}
                            >
                                Siguiente →
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TicketsListSection;
