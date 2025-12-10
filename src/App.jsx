import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import ReservationsPage from './pages/ReservationsPage';
import IncidentsPage from './pages/IncidentsPage';
import { useAuth } from './contexts/AuthContext';

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
                    <Route index element={<Navigate to="/reservas" replace />} />
                    <Route path="reservas" element={<ReservationsPage />} />
                    <Route path="incidencias" element={<IncidentsPage />} />
                    {/* Otras rutas... */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
