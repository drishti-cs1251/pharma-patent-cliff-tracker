// components/Auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const isNameValid = name.trim().length >= 2;
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRules).every(rule => rule);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isNameValid && isEmailValid(email) && isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (!isNameValid) { setError('Name must be at least 2 characters'); return; }
    if (!isEmailValid(email)) { setError('Please enter a valid email address'); return; }
    if (!isPasswordValid) { setError('Password does not meet requirements'); return; }
    if (!doPasswordsMatch) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      // data = { success: true, token, user: {id, name, email, role} }
      login(data.token, data.user);
      navigate('/');
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

        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            onFocus={() => setNameTouched(true)}
            required
            placeholder="Enter your full name"
            className={nameTouched && !isNameValid ? 'invalid' : ''}
          />
          {nameTouched && !isNameValid && name.length > 0 && (
            <div className="validation-popup invalid">
              <div className="validation-item">✗ Name must be at least 2 characters</div>
            </div>
          )}
        </div>

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