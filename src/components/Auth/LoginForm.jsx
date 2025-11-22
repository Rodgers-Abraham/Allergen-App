import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveUser, getUser } from '../../lib/storage';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const user = getUser();

        if (!user) {
            setError('User not found. Please sign up.');
            return;
        }

        // Check if email matches (optional, but good practice if we supported multiple users)
        // For this MVP single-user mode, we just check if the stored user matches.
        // But if the user enters a different email, we should probably say "wrong user".
        // However, storage only keeps ONE user. So we check if the entered email matches stored email.

        if (user.email && user.email.toLowerCase() !== email.toLowerCase()) {
            setError('Email does not match the registered account.');
            return;
        }

        if (user.password !== password) {
            setError('Incorrect password.');
            return;
        }

        navigate('/dashboard');
    };

    return (
        <div className="container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <img src="/logo.png" alt="My Allergy Diary Logo" style={{ width: '80px', height: '80px', marginBottom: '1rem' }} />
                <h1 style={{ color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>My Allergy Diary</h1>
                <p>Safe. Fun. Sure.</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />

                    {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.9em' }}>{error}</p>}

                    <button type="submit" className="btn-primary">Log In</button>
                </form>

                <p style={{ marginTop: '1rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
