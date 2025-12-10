import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
    const { logoutUser, user } = useAuth();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ width: '250px', background: '#343a40', color: 'white', padding: '20px' }}>
                <h2>Campus360</h2>
                <div style={{ marginBottom: '20px', fontSize: '0.9em', color: '#aaa' }}>
                    Hola, {user?.name || 'Usuario'}
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/reservas" style={{ color: 'white', textDecoration: 'none' }}>📅 Reservas</Link>
                    <Link to="/incidencias" style={{ color: 'white', textDecoration: 'none' }}>⚠️ Incidencias</Link>
                    <hr style={{ borderColor: '#555', width: '100%' }} />
                    <button onClick={logoutUser} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', textAlign: 'left', cursor: 'pointer' }}>
                        Cerrar Sesión
                    </button>
                </nav>
            </aside>
            <main style={{ flex: 1, padding: '20px', background: '#f8f9fa' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
