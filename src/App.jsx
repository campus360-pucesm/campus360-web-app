import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import IncidentsPage from './pages/IncidentsPage';
import { useAuth } from './contexts/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Dashboard from './pages/auth/Dashboard';
import AdminPanel from './pages/auth/AdminPanel';
import NotAuthorized from './pages/auth/NotAuthorized';
import NotFound from './pages/auth/NotFound';

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

// Componente para proteger rutas de admin
const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role !== "admin") return <Navigate to="/auth/no-access" />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth routes - public */}
                <Route path="/login" element={<Login />} />
                
                {/* Auth routes - protected */}
                <Route path="/auth/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                
                <Route path="/auth/admin" element={
                    <AdminRoute>
                        <AdminPanel />
                    </AdminRoute>
                } />
                
                <Route path="/auth/no-access" element={<NotAuthorized />} />
                <Route path="*" element={<NotFound />} />

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
