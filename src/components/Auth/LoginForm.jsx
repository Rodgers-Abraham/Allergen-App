import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scan, Utensils, Bot, ArrowRight } from 'lucide-react';
// Import your actual login logic
import { loginUser } from '../../lib/storage';

// --- DATA: The Fun Slides ---
const SLIDES = [
    {
        id: 1,
        title: "Scan & Safe",
        desc: "Instantly check ingredients for allergens with our AI scanner.",
        icon: <Scan size={80} color="#fff" />,
        bgColor: "#FF9AA2" // Pastel Red/Pink
    },
    {
        id: 2,
        title: "Safe Swaps",
        desc: "Found an allergen? We'll suggest delicious, safe alternatives!",
        icon: <Utensils size={80} color="#fff" />,
        bgColor: "#B5EAD7" // Pastel Green
    },
    {
        id: 3,
        title: "Chat Buddy",
        desc: "Meet your personal food safety assistant. Ask anything!",
        icon: <Bot size={80} color="#fff" />,
        bgColor: "#C7CEEA" // Pastel Purple
    }
];

const LoginForm = () => {
    const navigate = useNavigate();

    // State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const [currentSlide, setCurrentSlide] = useState(0);

    // --- AUTO-SLIDER LOGIC ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    // --- YOUR LOGIC MERGED HERE ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Simulate API delay (from your old code)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 2. Perform Login using your existing storage function
            // We use 'email' and 'password' state variables here directly
            const user = loginUser(email, password);

            console.log('Login successful:', user);

            // 3. Navigate on success
            navigate('/dashboard');

        } catch (err) {
            // Handle Error
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>

            {/* --- LEFT SIDE: THE FUN SLIDER --- */}
            <div style={{ ...styles.sliderSection, backgroundColor: SLIDES[currentSlide].bgColor }}>
                <div style={styles.sliderContent}>
                    <div style={styles.iconWrapper}>
                        {SLIDES[currentSlide].icon}
                    </div>
                    <h2 style={styles.slideTitle}>{SLIDES[currentSlide].title}</h2>
                    <p style={styles.slideDesc}>{SLIDES[currentSlide].desc}</p>

                    <div style={styles.dotsContainer}>
                        {SLIDES.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                style={{
                                    ...styles.dot,
                                    backgroundColor: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.4)',
                                    transform: currentSlide === idx ? 'scale(1.2)' : 'scale(1)'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: LOGIN FORM --- */}
            <div style={styles.formSection}>
                <div style={styles.formContainer}>
                    <div style={styles.header}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#333' }}>Welcome Back!</h1>
                        <p style={{ color: '#666' }}>Log in to your allergy diary</p>
                    </div>

                    <form onSubmit={handleLogin} style={styles.form}>
                        {error && <div style={styles.error}>{error}</div>}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : (
                                <>Log In <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ ...styles.link, fontWeight: 'bold' }}>Sign Up</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

// --- STYLES OBJECT ---
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', sans-serif",
    },
    sliderSection: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        transition: 'background-color 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
    },
    sliderContent: {
        textAlign: 'center',
        padding: '40px',
        maxWidth: '400px',
        animation: 'fadeIn 0.5s ease-in-out',
    },
    iconWrapper: {
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 30px auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    },
    slideTitle: {
        fontSize: '2.5rem',
        marginBottom: '1rem',
        fontWeight: '800'
    },
    slideDesc: {
        fontSize: '1.2rem',
        lineHeight: '1.6',
        opacity: 0.9,
        marginBottom: '40px'
    },
    dotsContainer: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
    },
    dot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    formSection: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: '20px'
    },
    formContainer: {
        width: '100%',
        maxWidth: '400px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#444',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '2px solid #eee',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box'
    },
    link: {
        color: '#28a745',
        textDecoration: 'none',
        fontSize: '0.9rem'
    },
    button: {
        padding: '14px',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '#28a745',
        color: 'white',
        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
        transition: 'opacity 0.2s'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '0.9rem',
        textAlign: 'center'
    },
};

export default LoginForm;