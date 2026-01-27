import { useState, useEffect } from 'react';
import styles from '../../styles/Incidencias.module.css';
import { getPrioridades, getCategorias, getUbicaciones, createTicket } from '../../api/incidenciasService';

/**
 * Sección para crear un nuevo ticket
 */
const CreateTicketSection = ({ onShowToast }) => {
    const [prioridades, setPrioridades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [resultado, setResultado] = useState(null);
    
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        prioridad_codigo: 'media',
        categoria_codigo: '',
        ubicacion_codigo: ''
    });

    useEffect(() => {
        loadCatalogos();
    }, []);

    const loadCatalogos = async () => {
        try {
            const [prioridadesData, categoriasData, ubicacionesData] = await Promise.all([
                getPrioridades(),
                getCategorias(),
                getUbicaciones()
            ]);
            // Asegurar que todos son arrays
            setPrioridades(Array.isArray(prioridadesData) ? prioridadesData : []);
            setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
            setUbicaciones(Array.isArray(ubicacionesData) ? ubicacionesData : []);
        } catch (error) {
            console.error('Error cargando catálogos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const ticketData = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            prioridad_codigo: formData.prioridad_codigo
        };
        
        if (formData.categoria_codigo) ticketData.categoria_codigo = formData.categoria_codigo;
        if (formData.ubicacion_codigo) ticketData.ubicacion_codigo = formData.ubicacion_codigo;
        
        try {
            const ticket = await createTicket(ticketData);
            setResultado({ success: true, data: ticket });
            onShowToast(`Ticket #${ticket.id} creado exitosamente`, 'success');
            
            // Limpiar formulario
            setFormData({
                titulo: '',
                descripcion: '',
                prioridad_codigo: 'media',
                categoria_codigo: '',
                ubicacion_codigo: ''
            });
        } catch (error) {
            setResultado({ success: false, data: error.response?.data || error });
            onShowToast('Error al crear ticket', 'error');
        }
    };

    return (
        <div>
            <h2>Crear Nuevo Ticket</h2>
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="titulo">Título *</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                        maxLength="200"
                        placeholder="Título de la incidencia"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="descripcion">Descripción *</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Descripción detallada del problema"
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="prioridad_codigo">Prioridad</label>
                        <select
                            id="prioridad_codigo"
                            name="prioridad_codigo"
                            value={formData.prioridad_codigo}
                            onChange={handleChange}
                        >
                            {prioridades.map(p => (
                                <option key={p.codigo} value={p.codigo}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="categoria_codigo">Categoría</label>
                        <select
                            id="categoria_codigo"
                            name="categoria_codigo"
                            value={formData.categoria_codigo}
                            onChange={handleChange}
                        >
                            <option value="">Sin categoría</option>
                            {categorias.map(c => (
                                <option key={c.codigo} value={c.codigo}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="ubicacion_codigo">Ubicación</label>
                        <select
                            id="ubicacion_codigo"
                            name="ubicacion_codigo"
                            value={formData.ubicacion_codigo}
                            onChange={handleChange}
                        >
                            <option value="">Sin ubicación</option>
                            {ubicaciones.map(u => (
                                <option key={u.codigo} value={u.codigo}>{u.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className={`${styles.btn} ${styles.btnSuccess}`}>
                    ✅ Crear Ticket
                </button>
            </form>

            {resultado && (
                <div className={`${styles.resultContainer} ${resultado.success ? styles.success : styles.error}`}>
                    <strong>{resultado.success ? '✅ Operación exitosa' : '❌ Error'}</strong>
                    <pre>{JSON.stringify(resultado.data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default CreateTicketSection;
