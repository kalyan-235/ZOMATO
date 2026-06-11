import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState('');
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await API.post('/auth/register', formData);
            setSuccess('Account created! Redirecting to login…');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="auth-logo">🍴 <span>Food Express</span></div>
                <h2>Create Account</h2>
                <p className="auth-sub">Join thousands of food lovers</p>

                {error   && <p className="auth-error">⚠️ {error}</p>}
                {success && <p className="auth-success">✅ {success}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text"     name="username" value={formData.username} onChange={handleChange} required placeholder="johndoe" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email"    name="email"    value={formData.email}    onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters" />
                    </div>
                    <button type="submit" className="signup-btn">Create Account</button>
                </form>
                <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;
