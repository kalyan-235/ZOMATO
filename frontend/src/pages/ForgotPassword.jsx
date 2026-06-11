import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import '../css/Auth.css';

const ForgotPassword = () => {
    const [step, setStep]         = useState(1); // 1=email, 2=otp, 3=newpass
    const [email, setEmail]       = useState('');
    const [otp, setOtp]           = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm]   = useState('');
    const [msg, setMsg]           = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setMsg('');
        try {
            const res = await API.post('/auth/forgot-password', { email });
            setMsg(res.data.message || 'OTP sent to your email. Check your inbox.');
            setStep(2);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to send OTP';
            setError(errMsg);
        } finally { setLoading(false); }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setMsg('');
        try {
            const res = await API.post('/auth/verify-otp', { email, otp });
            setResetToken(res.data.resetToken);
            setMsg('OTP verified! Set your new password.');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally { setLoading(false); }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirm) { setError('Passwords do not match.'); return; }
        if (newPassword.length < 6)  { setError('Password must be at least 6 characters.'); return; }
        setLoading(true); setError(''); setMsg('');
        try {
            await API.post('/auth/reset-password', { resetToken, newPassword });
            setMsg('Password reset successfully! You can now log in.');
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. Please start over.');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🍴 <span>Food Express</span></div>
                <h2>Reset Password</h2>

                {/* Step indicator */}
                <div className="auth-steps">
                    {['Email', 'OTP', 'New Password'].map((s, i) => (
                        <div key={i} className={`auth-step ${step > i + 1 ? 'auth-step-done' : step === i + 1 ? 'auth-step-active' : ''}`}>
                            <span>{step > i + 1 ? '✓' : i + 1}</span>
                            <label>{s}</label>
                        </div>
                    ))}
                </div>

                {msg   && <p className="auth-success">{msg}</p>}
                {error && <p className="auth-error">⚠️ {error}</p>}

                {/* Step 1 — Email */}
                {step === 1 && (
                    <form onSubmit={sendOtp}>
                        <div className="form-group">
                            <label>Registered Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Sending…' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* Step 2 — OTP */}
                {step === 2 && (
                    <form onSubmit={verifyOtp}>
                        <div className="form-group">
                            <label>Enter 6-digit OTP</label>
                            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} placeholder="_ _ _ _ _ _" className="otp-input" />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Verifying…' : 'Verify OTP'}
                        </button>
                        <button type="button" className="auth-btn-outline" onClick={() => { setStep(1); setMsg(''); setError(''); }}>
                            ← Back
                        </button>
                    </form>
                )}

                {/* Step 3 — New password */}
                {step === 3 && (
                    <form onSubmit={resetPassword}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Min. 6 characters" />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Resetting…' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {/* Step 4 — Done */}
                {step === 4 && (
                    <div className="auth-done">
                        <div className="auth-done-icon">🎉</div>
                        <p>Your password has been reset successfully.</p>
                        <Link to="/login" className="auth-btn">Go to Login</Link>
                    </div>
                )}

                {step === 1 && (
                    <p className="auth-footer"><Link to="/login">← Back to Login</Link></p>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
