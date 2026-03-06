// components/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid(email) && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!isEmailValid(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!isPasswordValid) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form login-form">
      <h2>Welcome Back</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            onFocus={() => setEmailTouched(true)}
            required
            placeholder="Enter your email"
            className={emailTouched && !isEmailValid(email) ? 'invalid' : ''}
          />
          {emailTouched && !isEmailValid(email) && email.length > 0 && (
            <div className="validation-popup invalid">
              <div className="validation-item">✗ Please enter a valid email address</div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            onFocus={() => setPasswordTouched(true)}
            required
            placeholder="Enter your password"
            className={passwordTouched && !isPasswordValid ? 'invalid' : ''}
          />
          {passwordTouched && !isPasswordValid && password.length > 0 && (
            <div className="validation-popup invalid">
              <div className="validation-item">✗ Password must be at least 8 characters</div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={!isFormValid ? 'disabled' : ''}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="auth-link">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}