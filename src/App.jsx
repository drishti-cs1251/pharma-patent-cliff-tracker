import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DiseaseSearch from './pages/DiseaseSearch';
import About from './pages/About';
import DrugSearch from './pages/DrugSearch';
import EDAPage from './pages/EdaPage';           
import Predictions from './pages/Predictions'; 

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/disease-search" element={<DiseaseSearch />} />
        <Route path="/about" element={<About />} />
        <Route path="/drug-search" element={<DrugSearch />} />
        <Route path="/analytics" element={<EDAPage />} />           {/* ← NEW */}
        <Route path="/predictions" element={<Predictions />} /> {/* ← NEW */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
