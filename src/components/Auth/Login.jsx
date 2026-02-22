// components/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  const navigate = useNavigate();

  // Email validation
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // For login, we just check if password is not empty (server will validate)
  const isPasswordValid = password.length >= 8;

  // Check if form is valid
  const isFormValid = isEmailValid(email) && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);

    // Validation
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
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form login-form">
      <h2>Welcome Back</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
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
          
          {/* Email validation popup */}
          {emailTouched && !isEmailValid(email) && email.length > 0 && (
            <div className="validation-popup invalid">
              <div className="validation-item">
                ✗ Please enter a valid email address
              </div>
            </div>
          )}
        </div>

        {/* Password Field */}
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
          
          {/* Password validation popup */}
          {passwordTouched && !isPasswordValid && password.length > 0 && (
            <div className="validation-popup invalid">
              <div className="validation-item">
                ✗ Password must be at least 8 characters
              </div>
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