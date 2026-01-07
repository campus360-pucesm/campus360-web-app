import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import IncidentsPage from './pages/IncidentsPage';
import { useAuth } from './contexts/AuthContext';

// Importar Dashboard principal del módulo de reservas (en src/pages)
import ReservationsPage from './pages/ReservationsPage';

// Importar páginas internas del módulo de reservas (en src/reservas/pages)
import DisponibilidadPage from './reservas/pages/DisponibilidadPage';
import MisReservasPage from './reservas/pages/MisReservasPage';

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/" element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }>
                    {/* Ruta principal - redirige al dashboard de reservas */}
                    <Route index element={<Navigate to="/reservas" replace />} />
                    
                    {/* Dashboard principal del módulo de Reservas */}
                    <Route path="reservas" element={<ReservationsPage />} />
                    
                    {/* Páginas internas del módulo de Reservas */}
                    <Route path="reservas/disponibilidad/:tipo" element={<DisponibilidadPage />} />
                    <Route path="reservas/mis-reservas" element={<MisReservasPage />} />
                    
                    {/* Otros módulos */}
                    <Route path="incidencias" element={<IncidentsPage />} />
                    {/* Aquí irán otros módulos: nómina, finanzas, etc... */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
