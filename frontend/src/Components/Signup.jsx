import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

/* Password strength checker */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { label: '',         color: '' },
    { label: 'Weak',     color: '#e23744' },
    { label: 'Fair',     color: '#f9a825' },
    { label: 'Good',     color: '#1e88e5' },
    { label: 'Strong',   color: '#43a047' },
  ];
  return { score, ...levels[score] };
};

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [accountType, setAccountType] = useState('');
  const navigate = useNavigate();

  const strength = getStrength(formData.password);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    /* Client-side validations */
    if (formData.username.length < 3) {
      return setError('Username must be at least 3 characters.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (strength.score < 2) {
      return setError('Password is too weak. Add uppercase letters, numbers or symbols.');
    }

    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card signup-role-card">
        <div className="auth-logo">🍴 <span>Food Express</span></div>
        <h2>{accountType === 'customer' ? 'Customer sign up' : 'Create Account'}</h2>
        <p className="auth-sub">
          {accountType === 'customer' ? 'Join thousands of food lovers' : 'Choose how you want to join Food Express'}
        </p>

        <div className="signup-account-options" role="group" aria-label="Choose account type">
          <button
            type="button"
            className={`signup-account-option ${accountType === 'customer' ? 'signup-account-option-active' : ''}`}
            onClick={() => { setAccountType('customer'); setError(''); }}
            aria-pressed={accountType === 'customer'}
          >
            <span className="signup-account-icon" aria-hidden="true">🍽️</span>
            <strong>Customer</strong>
            <small>Sign up to browse and order food</small>
          </button>
          <Link className="signup-account-option" to="/restaurant/register">
            <span className="signup-account-icon" aria-hidden="true">🏪</span>
            <strong>Restaurant</strong>
            <small>Register your restaurant for approval</small>
          </Link>
        </div>

        {error && <p className="auth-error" role="alert">⚠️ {error}</p>}
        {success && <p className="auth-success" role="status">✅ {success}</p>}

        {accountType === 'customer' ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signup-username">Username</label>
              <input id="signup-username" type="text" name="username" value={formData.username}
                onChange={handleChange} required placeholder="johndoe (min 3 chars)" />
            </div>
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input id="signup-email" type="email" name="email" value={formData.email}
                onChange={handleChange} required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" type="password" name="password" value={formData.password}
                onChange={handleChange} required placeholder="Min. 6 characters" />

              {formData.password && (
                <div className="pwd-strength-wrap">
                  <div className="pwd-strength-bar">
                    {[1,2,3,4].map(n => (
                      <div key={n} className="pwd-segment"
                        style={{ background: n <= strength.score ? strength.color : '#e0e0e0' }} />
                    ))}
                  </div>
                  <span className="pwd-strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
              <small className="pwd-hint">
                Use 8+ chars, uppercase, numbers & symbols for a strong password.
              </small>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        ) : (
          <p className="signup-choice-hint">Select Customer to continue with the regular signup form.</p>
        )}
        <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;
