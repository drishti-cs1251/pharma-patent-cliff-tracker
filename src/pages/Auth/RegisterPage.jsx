// pages/Auth/RegisterPage.jsx
import Register from '../../components/Auth/Register';
import './AuthPages.css';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Patent Cliff Tracker</h1>
          <p>Track prescription drug patents and save money</p>
        </div>
        <Register />
      </div>
    </div>
  );
}