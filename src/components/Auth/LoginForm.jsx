import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { loginUser } from '../../lib/storage';
// import SignupForm from '../../SignupForm';
// import SignupForm from '../../SignupForm';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const user = loginUser(formData.email, formData.password);
            // const user = { name: "Test User" };

            console.log('Login successful:', user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-text-header)' }}>Log In</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />

                    {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.9em' }}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--color-text)', fontSize: '0.9em' }}>Forgot Password?</Link>
                    <p>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)' }}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
