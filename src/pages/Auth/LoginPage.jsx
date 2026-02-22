// pages/Auth/LoginPage.jsx
import Login from '../../components/Auth/Login';
import './AuthPages.css';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Patent Cliff Tracker</h1>
          <p>Track prescription drug patents and save money</p>
        </div>
        <Login />
      </div>
    </div>
  );
}