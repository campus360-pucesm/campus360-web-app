import { useState } from 'react';
import styles from '../../styles/Incidencias.module.css';
import { getEstados, getPrioridades, getCategorias, getUbicaciones } from '../../api/incidenciasService';

/**
 * Sección de Catálogos - muestra los catálogos del sistema
 */
const CatalogosSection = ({ onShowToast }) => {
    const [estados, setEstados] = useState([]);
    const [prioridades, setPrioridades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);

    const cargarEstados = async () => {
        try {
            const data = await getEstados();
            // Asegurar que data es un array
            const estadosArray = Array.isArray(data) ? data : [];
            setEstados(estadosArray);
            onShowToast(`${estadosArray.length} estados cargados`, 'success');
        } catch (error) {
            console.error('Error al cargar estados:', error);
            onShowToast('Error al cargar estados', 'error');
        }
    };

    const cargarPrioridades = async () => {
        try {
            const data = await getPrioridades();
            const prioridadesArray = Array.isArray(data) ? data : [];
            setPrioridades(prioridadesArray);
            onShowToast(`${prioridadesArray.length} prioridades cargadas`, 'success');
        } catch (error) {
            console.error('Error al cargar prioridades:', error);
            onShowToast('Error al cargar prioridades', 'error');
        }
    };

    const cargarCategorias = async () => {
        try {
            const data = await getCategorias();
            const categoriasArray = Array.isArray(data) ? data : [];
            setCategorias(categoriasArray);
            onShowToast(`${categoriasArray.length} categorías cargadas`, 'success');
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            onShowToast('Error al cargar categorías', 'error');
        }
    };

    const cargarUbicaciones = async () => {
        try {
            const data = await getUbicaciones();
            const ubicacionesArray = Array.isArray(data) ? data : [];
            setUbicaciones(ubicacionesArray);
            onShowToast(`${ubicacionesArray.length} ubicaciones cargadas`, 'success');
        } catch (error) {
            console.error('Error al cargar ubicaciones:', error);
            onShowToast('Error al cargar ubicaciones', 'error');
        }
    };

    const getPrioridadClass = (codigo) => {
        const classes = {
            'baja': 'badgePrioridadBaja',
            'media': 'badgePrioridadMedia',
            'alta': 'badgePrioridadAlta',
            'critica': 'badgePrioridadCritica'
        };
        return styles[classes[codigo]] || styles.badgeEstado;
    };

    return (
        <div>
            <h2>Catálogos del Sistema</h2>
            <div className={styles.catalogosGrid}>
                {/* Estados */}
                <div className={styles.catalogoCard}>
                    <h3>Estados</h3>
                    <button onClick={cargarEstados} className={`${styles.btn} ${styles.btnPrimary}`}>
                        Cargar Estados
                    </button>
                    <div className={styles.listContainer}>
                        {estados.map(e => (
                            <div key={e.codigo} className={styles.listItem}>
                                <span>{e.nombre}</span>
                                <span className={`${styles.badge} ${styles[`estado-${e.codigo}`]}`}>
                                    {e.codigo}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prioridades */}
                <div className={styles.catalogoCard}>
                    <h3>Prioridades</h3>
                    <button onClick={cargarPrioridades} className={`${styles.btn} ${styles.btnPrimary}`}>
                        Cargar Prioridades
                    </button>
                    <div className={styles.listContainer}>
                        {prioridades.map(p => (
                            <div key={p.codigo} className={styles.listItem}>
                                <span>{p.nombre}</span>
                                <span className={`${styles.badge} ${getPrioridadClass(p.codigo)}`}>
                                    {p.codigo}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categorías */}
                <div className={styles.catalogoCard}>
                    <h3>Categorías</h3>
                    <button onClick={cargarCategorias} className={`${styles.btn} ${styles.btnPrimary}`}>
                        Cargar Categorías
                    </button>
                    <div className={styles.listContainer}>
                        {categorias.length > 0 ? (
                            categorias.map(c => (
                                <div key={c.codigo} className={styles.listItem}>
                                    <span>{c.nombre}</span>
                                    <span className={`${styles.badge} ${styles.badgeEstado}`}>
                                        {c.codigo}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>No hay categorías</div>
                        )}
                    </div>
                </div>

                {/* Ubicaciones */}
                <div className={styles.catalogoCard}>
                    <h3>Ubicaciones</h3>
                    <button onClick={cargarUbicaciones} className={`${styles.btn} ${styles.btnPrimary}`}>
                        Cargar Ubicaciones
                    </button>
                    <div className={styles.listContainer}>
                        {ubicaciones.length > 0 ? (
                            ubicaciones.map(u => (
                                <div key={u.codigo} className={styles.listItem}>
                                    <span>{u.nombre}</span>
                                    <span className={`${styles.badge} ${styles.badgeEstado}`}>
                                        {u.tipo || u.codigo}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>No hay ubicaciones</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogosSection;
