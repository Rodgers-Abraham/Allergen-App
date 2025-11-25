import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../lib/storage';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            resetPassword(email, newPassword);
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: '60px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)', margin: '0 0 1rem 0' }}>Reset Password</h2>
                <p style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                    Enter your email and a new password to reset your account access.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />

                    {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.9em' }}>{error}</p>}
                    {success && <p style={{ color: 'var(--color-success)', fontSize: '0.9em' }}>{success}</p>}

                    <button type="submit" className="btn-primary">Reset Password</button>
                </form>

                <div style={{ marginTop: '1rem' }}>
                    <Link to="/" style={{ color: 'var(--color-primary)' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
