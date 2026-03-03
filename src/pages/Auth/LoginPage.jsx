// pages/Auth/LoginPage.jsx
import Login from '../../components/Auth/Login';
import Header from '../../components/Layout/Header';  // ← Add this
import './AuthPages.css';

export default function LoginPage() {
  return (
    <div className="auth-page-wrapper">  {/* ← Changed class name */}
      <Header />  {/* ← Add Header */}
      
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Patent Cliff Tracker</h1>
            <p>Track prescription drug patents and save money</p>
          </div>
          <Login />
        </div>
      </div>
    </div>
  );
}