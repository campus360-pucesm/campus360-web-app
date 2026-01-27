import { useState } from 'react';
import styles from '../styles/Incidencias.module.css';
import Toast from '../components/common/Toast';
import CatalogosSection from '../components/incidencias/CatalogosSection';
import TicketsListSection from '../components/incidencias/TicketsListSection';
import CreateTicketSection from '../components/incidencias/CreateTicketSection';
import TicketDetailSection from '../components/incidencias/TicketDetailSection';
import ActionsSection from '../components/incidencias/ActionsSection';

/**
 * Página principal del módulo de Incidencias
 */
const IncidentsPage = () => {
    const [activeSection, setActiveSection] = useState('catalogos');
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [ticketIdToView, setTicketIdToView] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'info' });
    };

    const handleViewTicket = (ticketId) => {
        setTicketIdToView(ticketId);
        setActiveSection('detalle-ticket');
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'catalogos':
                return <CatalogosSection onShowToast={showToast} />;
            case 'tickets':
                return <TicketsListSection onShowToast={showToast} onViewTicket={handleViewTicket} />;
            case 'crear-ticket':
                return <CreateTicketSection onShowToast={showToast} />;
            case 'detalle-ticket':
                return <TicketDetailSection ticketIdProp={ticketIdToView} onShowToast={showToast} />;
            case 'acciones':
                return <ActionsSection onShowToast={showToast} />;
            default:
                return <CatalogosSection onShowToast={showToast} />;
        }
    };

    return (
        <div className={styles.incidenciasPage}>
            <header className={styles.header}>
                <h1>🎓 Campus360 - Incidencias</h1>
            </header>

            <nav className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeSection === 'catalogos' ? styles.active : ''}`}
                    onClick={() => setActiveSection('catalogos')}
                >
                    📋 Catálogos
                </button>
                <button
                    className={`${styles.tab} ${activeSection === 'tickets' ? styles.active : ''}`}
                    onClick={() => setActiveSection('tickets')}
                >
                    🎫 Tickets
                </button>
                <button
                    className={`${styles.tab} ${activeSection === 'crear-ticket' ? styles.active : ''}`}
                    onClick={() => setActiveSection('crear-ticket')}
                >
                    ➕ Crear Ticket
                </button>
                <button
                    className={`${styles.tab} ${activeSection === 'detalle-ticket' ? styles.active : ''}`}
                    onClick={() => setActiveSection('detalle-ticket')}
                >
                    🔍 Detalle Ticket
                </button>
                <button
                    className={`${styles.tab} ${activeSection === 'acciones' ? styles.active : ''}`}
                    onClick={() => setActiveSection('acciones')}
                >
                    ⚡ Acciones
                </button>
            </nav>

            <main className={styles.mainContent}>
                {renderSection()}
            </main>

            <Toast
                message={toast.message}
                type={toast.type}
                show={toast.show}
                onClose={closeToast}
            />
        </div>
    );
};

export default IncidentsPage;
