// components/Layout/Header.jsx
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')}>
          <h1>💊 Patent Cliff Tracker</h1>
        </div>
        
        <nav className="nav-menu">
          <a href="/">Home</a>
          {token ? (
            <>
              <a href="/dashboard">Dashboard</a>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
              <a href="/about">About</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}