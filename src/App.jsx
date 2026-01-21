import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import { useAuth } from './contexts/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Dashboard from './pages/auth/Dashboard';
import AdminPanel from './pages/auth/AdminPanel';
import NotAuthorized from './pages/auth/NotAuthorized';
import NotFound from './pages/auth/NotFound';

// Dashboard Principal (NUEVO)
import HomePage from './pages/HomePage';

// Módulo de Reservas
import ReservationsPage from './pages/ReservationsPage';
import DisponibilidadPage from './reservas/pages/DisponibilidadPage';
import MisReservasPage from './reservas/pages/MisReservasPage';

// Otros módulos
import IncidentsPage from './pages/IncidentsPage';
import AttendancePage from './pages/AttendancePage';

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
                {/* ====== Rutas Públicas ====== */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth/no-access" element={<NotAuthorized />} />

                {/* ====== Rutas del Módulo Auth (sin MainLayout) ====== */}
                {/* Dashboard de Credencial/QR */}
                <Route path="/auth/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                
                {/* Panel de Administración */}
                <Route path="/auth/admin" element={
                    <AdminRoute>
                        <AdminPanel />
                    </AdminRoute>
                } />

                {/* ====== Rutas Principales con MainLayout ====== */}
                <Route path="/" element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }>
                    {/* Dashboard Principal - página de inicio después del login */}
                    <Route index element={<HomePage />} />
                    
                    {/* ====== Módulo de Reservas ====== */}
                    <Route path="reservas" element={<ReservationsPage />} />
                    <Route path="reservas/disponibilidad/:tipo" element={<DisponibilidadPage />} />
                    <Route path="reservas/mis-reservas" element={<MisReservasPage />} />
                    
                    {/* ====== Módulo de Asistencia ====== */}
                    <Route path="asistencia" element={<AttendancePage />} />
                    
                    {/* ====== Módulo de Incidencias ====== */}
                    <Route path="incidencias" element={<IncidentsPage />} />
                    
                    {/* Aquí irán otros módulos en el futuro */}
                </Route>

                {/* ====== 404 - Página no encontrada ====== */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;