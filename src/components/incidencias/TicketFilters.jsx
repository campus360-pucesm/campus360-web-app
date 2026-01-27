import { useState, useEffect } from 'react';
import styles from '../../styles/Incidencias.module.css';
import { getEstados, getPrioridades, getCategorias } from '../../api/incidenciasService';

/**
 * Componente de filtros para tickets
 */
const TicketFilters = ({ onFilter }) => {
    const [estados, setEstados] = useState([]);
    const [prioridades, setPrioridades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    
    const [filters, setFilters] = useState({
        estado_codigo: '',
        prioridad_codigo: '',
        categoria_codigo: '',
        limit: 10,
        offset: 0
    });

    useEffect(() => {
        loadCatalogos();
    }, []);

    const loadCatalogos = async () => {
        try {
            const [estadosData, prioridadesData, categoriasData] = await Promise.all([
                getEstados(),
                getPrioridades(),
                getCategorias()
            ]);
            // Asegurar que todos son arrays
            setEstados(Array.isArray(estadosData) ? estadosData : []);
            setPrioridades(Array.isArray(prioridadesData) ? prioridadesData : []);
            setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
        } catch (error) {
            console.error('Error cargando catálogos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    return (
        <form className={styles.filters} onSubmit={handleSubmit}>
            <div className={styles.filterGroup}>
                <label>Estado:</label>
                <select name="estado_codigo" value={filters.estado_codigo} onChange={handleChange}>
                    <option value="">Todos</option>
                    {estados.map(e => (
                        <option key={e.codigo} value={e.codigo}>{e.nombre}</option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label>Prioridad:</label>
                <select name="prioridad_codigo" value={filters.prioridad_codigo} onChange={handleChange}>
                    <option value="">Todas</option>
                    {prioridades.map(p => (
                        <option key={p.codigo} value={p.codigo}>{p.nombre}</option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label>Categoría:</label>
                <select name="categoria_codigo" value={filters.categoria_codigo} onChange={handleChange}>
                    <option value="">Todas</option>
                    {categorias.map(c => (
                        <option key={c.codigo} value={c.codigo}>{c.nombre}</option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label>Límite:</label>
                <input
                    type="number"
                    name="limit"
                    value={filters.limit}
                    onChange={handleChange}
                    min="1"
                    max="100"
                />
            </div>

            <div className={styles.filterGroup}>
                <label>Offset:</label>
                <input
                    type="number"
                    name="offset"
                    value={filters.offset}
                    onChange={handleChange}
                    min="0"
                />
            </div>

            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                🔍 Buscar
            </button>
        </form>
    );
};

export default TicketFilters;
