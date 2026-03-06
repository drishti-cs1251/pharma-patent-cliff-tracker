// components/Auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import './Auth.css';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const navigate = useNavigate();

  // Email validation
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation rules
  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRules).every(rule => rule);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Check if form is valid
  const isFormValid = isEmailValid(email) && isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    // Final validation
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Passwords do not match');
      return;
    }
    

    setLoading(true);

    try {
      await register(email, password);
      login(data.token, data.user);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-form register-form">
      <h2>Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
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
          {emailTouched && (
            <div className={`validation-popup ${isEmailValid(email) ? 'valid' : 'invalid'}`}>
              <div className="validation-item">
                {isEmailValid(email) ? '✓' : '✗'} Valid email format (e.g., user@example.com)
              </div>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            onFocus={() => setPasswordTouched(true)}
            required
            placeholder="Create a strong password"
            className={passwordTouched && !isPasswordValid ? 'invalid' : ''}
          />
          
          {/* Password validation popup */}
          {passwordTouched && (
            <div className={`validation-popup ${isPasswordValid ? 'valid' : 'invalid'}`}>
              <div className="validation-title">Password must contain:</div>
              <div className={`validation-item ${passwordRules.minLength ? 'met' : 'unmet'}`}>
                {passwordRules.minLength ? '✓' : '✗'} At least 8 characters
              </div>
              <div className={`validation-item ${passwordRules.hasUpperCase ? 'met' : 'unmet'}`}>
                {passwordRules.hasUpperCase ? '✓' : '✗'} One uppercase letter (A-Z)
              </div>
              <div className={`validation-item ${passwordRules.hasLowerCase ? 'met' : 'unmet'}`}>
                {passwordRules.hasLowerCase ? '✓' : '✗'} One lowercase letter (a-z)
              </div>
              <div className={`validation-item ${passwordRules.hasNumber ? 'met' : 'unmet'}`}>
                {passwordRules.hasNumber ? '✓' : '✗'} One number (0-9)
              </div>
              <div className={`validation-item ${passwordRules.hasSpecialChar ? 'met' : 'unmet'}`}>
                {passwordRules.hasSpecialChar ? '✓' : '✗'} One special character (!@#$%^&*)
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setConfirmPasswordTouched(true)}
            onFocus={() => setConfirmPasswordTouched(true)}
            required
            placeholder="Re-enter your password"
            className={confirmPasswordTouched && !doPasswordsMatch ? 'invalid' : ''}
          />
          
          {/* Confirm password validation popup */}
          {confirmPasswordTouched && confirmPassword.length > 0 && (
            <div className={`validation-popup ${doPasswordsMatch ? 'valid' : 'invalid'}`}>
              <div className="validation-item">
                {doPasswordsMatch ? '✓' : '✗'} Passwords match
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !isFormValid}
          className={!isFormValid ? 'disabled' : ''}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="auth-link">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}