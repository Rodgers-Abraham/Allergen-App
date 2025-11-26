import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getHistory, logoutUser, getTheme, saveTheme } from '../../lib/storage';
import Character from './Character';
import { Scan, LogOut, Moon, Sun, History, Gamepad2, MessageCircle } from 'lucide-react';
import SOSButton from '../Safety/SOSButton';
const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            navigate('/');
            return;
        }
        setUser(userData);
        setHistory(getHistory());

        const savedTheme = getTheme();
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, [navigate]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        saveTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* --- HEADER --- */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                    onClick={() => navigate('/profile')}
                >
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }} />
                    ) : (
                        <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
                    )}
                    <div>
                        <h2 style={{ margin: 0 }}>Hi, {user.nickname}!</h2>
                        <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Ready to hunt allergens?</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={toggleTheme} style={{ padding: '8px' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={handleLogout} style={{ padding: '8px' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* --- MIDDLE SECTION (GRID) --- */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                alignContent: 'center',
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto'
            }}>

                {/* 1. Character */}
                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <Character status="happy" />
                </div>

                {/* 2. Scan Button */}
                <button
                    className="btn-primary"
                    style={{
                        gridColumn: 'span 2',
                        fontSize: '1.5rem',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '20px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                    }}
                    onClick={() => navigate('/scan')}
                >
                    <Scan size={40} />
                    Scan Food
                </button>

                {/* 3. Game Button */}
                <button
                    style={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-primary)',
                        border: '2px solid var(--color-primary)',
                        fontSize: '1rem',
                        padding: '1.5rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        aspectRatio: '1/1'
                    }}
                    onClick={() => navigate('/game')}
                >
                    <Gamepad2 size={32} />
                    Play Hero
                </button>

                {/* 4. Chat Button */}
                <button
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        fontSize: '1rem',
                        padding: '1.5rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
                        aspectRatio: '1/1'
                    }}
                    onClick={() => navigate('/buddy')}
                >
                    <MessageCircle size={32} />
                    Chat Buddy
                </button>
            </div>

            {/* --- RECENT SCANS --- */}
            <div style={{ marginTop: '2rem' }}>
                <h3><History size={16} style={{ verticalAlign: 'middle' }} /> Recent Scans</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                    {history.length === 0 ? (
                        <p style={{ opacity: 0.6, fontStyle: 'italic' }}>No scans yet.</p>
                    ) : (
                        history.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="card" style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{item.product ? item.product.name : 'Unknown Product'}</span>
                                <span style={{
                                    color: item.status === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)',
                                    fontWeight: 'bold'
                                }}>
                                    {item.status.toUpperCase()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- THE FOOTER (Only visible here) --- */}
            <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', color: '#666', fontSize: '0.8rem', opacity: 0.7 }}>
                BUILT BY BLACK PUPPY 🐾
            </div>

            {/* The Smart SOS Button */}
            <SOSButton />
        </div>
    );
};

export default Home;