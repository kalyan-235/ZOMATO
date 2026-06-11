import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError]       = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await API.post('/auth/login', formData);
            login(res.data.user, res.data.token);

            // Admin → dashboard, user → home
            if (res.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="auth-logo">🍴 <span>Food Express</span></div>
                <h2>Welcome Back</h2>
                <p className="auth-sub">Sign in to continue</p>

                {error && <p className="auth-error">⚠️ {error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email"    name="email"    value={formData.email}    onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Your password" />
                    </div>
                    <div className="auth-forgot">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <p className="auth-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
    );
};

export default Login;
