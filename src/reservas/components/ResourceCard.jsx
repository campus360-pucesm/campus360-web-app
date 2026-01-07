import '../styles/ResourceCard.css';

/**
 * Componente para mostrar una tarjeta de recurso
 * Similar al diseño mostrado en la imagen (Salas de Estudio, Laboratorios, etc.)
 */
const ResourceCard = ({ tipo, nombre, cantidad, capacidad, imagen, onVerDisponibilidad }) => {
    // Mapeo de iconos y colores por tipo de recurso
    const tipoConfig = {
        sala_estudio: {
            titulo: 'Salas de Estudio',
            icono: '📚',
            color: '#e3f2fd'
        },
        laboratorio: {
            titulo: 'Laboratorios',
            icono: '🔬',
            color: '#f3e5f5'
        },
        equipo: {
            titulo: 'Equipos',
            icono: '💻',
            color: '#fff3e0'
        },
        parqueadero: {
            titulo: 'Estacionamientos',
            icono: '🚗',
            color: '#e8f5e9'
        },
        modulo_biblioteca: {
            titulo: 'Módulos de Biblioteca',
            icono: '📖',
            color: '#fce4ec'
        }
    };

    const config = tipoConfig[tipo] || tipoConfig.sala_estudio;

    return (
        <div className="resource-card" style={{ backgroundColor: config.color }}>
            <div className="resource-card-content">
                <div className="resource-icon">{config.icono}</div>
                <h3 className="resource-title">{nombre || config.titulo}</h3>
                
                {/* Información de cantidad y capacidad */}
                {(cantidad || capacidad) && (
                    <div className="resource-info">
                        {cantidad && <span className="resource-cantidad">{cantidad} disponibles</span>}
                        {capacidad && <span className="resource-capacidad">Cap. {capacidad} personas</span>}
                    </div>
                )}
                
                {imagen && (
                    <div className="resource-image">
                        <img src={imagen} alt={nombre} />
                    </div>
                )}
            </div>
            
            <button 
                className="btn-ver-disponibilidad"
                onClick={() => onVerDisponibilidad(tipo)}
            >
                Ver disponibilidad
            </button>
        </div>
    );
};

export default ResourceCard;
