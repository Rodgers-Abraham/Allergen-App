import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Trash2, Utensils, Flame, Trophy } from 'lucide-react';

// --- EXPANDED DATABASE ---
const FOOD_ITEMS = [
    { name: "Peanut Butter", image: "🥜", allergens: ["Peanuts"] },
    { name: "Apple", image: "🍎", allergens: [] },
    { name: "Milkshake", image: "🥤", allergens: ["Milk"] },
    { name: "Bread", image: "🍞", allergens: ["Wheat", "Gluten"] },
    { name: "Fish Sticks", image: "🐟", allergens: ["Fish"] },
    { name: "Broccoli", image: "🥦", allergens: [] },
    { name: "Cheese", image: "🧀", allergens: ["Milk"] },
    { name: "Egg", image: "🥚", allergens: ["Eggs"] },
    { name: "Shrimp", image: "🦐", allergens: ["Shellfish"] },
    { name: "Soy Sauce", image: "🥢", allergens: ["Soy", "Wheat"] },
    { name: "Almonds", image: "🌰", allergens: ["Tree Nuts"] },
    { name: "Watermelon", image: "🍉", allergens: [] },
    { name: "Pizza", image: "🍕", allergens: ["Wheat", "Milk"] },
    { name: "Banana", image: "🍌", allergens: [] },
    { name: "Yogurt", image: "🥣", allergens: ["Milk"] },
];

// --- SOUND ENGINE (No assets needed!) ---
const playSound = (type) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'win') {
        // Happy "Ding" Sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'lose') {
        // Sad "Buzz" Sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'highscore') {
        // Victory Fanfare
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }
};

// --- CONFETTI COMPONENT ---
const Confetti = ({ active }) => {
    if (!active) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `-20px`,
                        width: '10px',
                        height: '10px',
                        backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                        animation: `fall ${Math.random() * 2 + 1}s linear forwards`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
            <style>{`
                @keyframes fall {
                    to { transform: translateY(100vh) rotate(720deg); }
                }
            `}</style>
        </div>
    );
};

const HeroGame = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [streak, setStreak] = useState(0); // New Feature: Streak
    const [currentItem, setCurrentItem] = useState(null);
    const [message, setMessage] = useState("Is this safe for you?");
    const [userAllergens, setUserAllergens] = useState([]);
    const [animationState, setAnimationState] = useState(''); // 'correct', 'wrong', 'enter'
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Load data
        const savedHigh = localStorage.getItem('heroHighScore');
        if (savedHigh) setHighScore(parseInt(savedHigh));

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserAllergens(user.allergens || []);
        } else {
            setUserAllergens(["Peanuts", "Milk"]); // Default
        }

        nextRound();
    }, []);

    const nextRound = useCallback(() => {
        setAnimationState('enter');
        const randomItem = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
        setCurrentItem(randomItem);
        setMessage("Is this safe for you?");
    }, []);

    const handleChoice = (action) => {
        if (!currentItem || animationState === 'correct' || animationState === 'wrong') return;

        const isAllergic = currentItem.allergens.some(a => userAllergens.includes(a));
        let isCorrect = false;

        if (action === 'eat') {
            isCorrect = !isAllergic;
        } else if (action === 'trash') {
            isCorrect = isAllergic;
        }

        if (isCorrect) {
            // --- WIN LOGIC ---
            playSound('win');
            if (navigator.vibrate) navigator.vibrate(50); // Light tap

            // Streak Bonus calculation
            const newStreak = streak + 1;
            setStreak(newStreak);
            const bonus = newStreak > 2 ? newStreak * 2 : 0;
            const points = 10 + bonus;

            const newScore = score + points;
            setScore(newScore);
            setAnimationState('correct');
            setMessage(bonus > 0 ? `Correct! +${points} (Streak x${newStreak})` : "Correct! +10");

            // High Score Check
            if (newScore > highScore) {
                if (highScore > 0 && !showConfetti) {
                    playSound('highscore');
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }
                setHighScore(newScore);
                localStorage.setItem('heroHighScore', newScore);
            }

            setTimeout(nextRound, 800); // Faster transition
        } else {
            // --- LOSE LOGIC ---
            playSound('lose');
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Heavy buzz

            setStreak(0); // Reset streak
            setAnimationState('wrong');
            setMessage("Oops! That was dangerous!");
            setScore(0); // Hardcore mode: Reset score

            setTimeout(nextRound, 1500);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', padding: '20px', display: 'flex', flexDirection: 'column', color: 'white', fontFamily: 'sans-serif' }}>
            <Confetti active={showConfetti} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#4ade80', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Allergy Hero</h2>
                    {streak > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fbbf24', fontSize: '0.9rem', animation: 'pulse 1s infinite' }}>
                            <Flame size={14} fill="#fbbf24" /> {streak} Streak!
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '5px 10px', borderRadius: '20px' }}>
                    <Shield size={18} color="gold" fill="gold" />
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{highScore}</span>
                </div>
            </div>

            {/* Score Board */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: '800', textShadow: '0 4px 10px rgba(0,0,0,0.5)', transition: 'all 0.3s' }}>
                    {score}
                </div>
                <p style={{ margin: 0, opacity: 0.7 }}>Points</p>
            </div>

            {/* Game Card Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', position: 'relative' }}>

                {/* Feedback Overlay */}
                {animationState === 'correct' && (
                    <div style={{ position: 'absolute', zIndex: 20, fontSize: '5rem', animation: 'bounceIn 0.5s' }}>✅</div>
                )}
                {animationState === 'wrong' && (
                    <div style={{ position: 'absolute', zIndex: 20, fontSize: '5rem', animation: 'shake 0.5s' }}>❌</div>
                )}

                {currentItem && (
                    <div style={{
                        width: '240px',
                        height: '240px',
                        backgroundColor: '#2d2d2d',
                        borderRadius: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: animationState === 'correct'
                            ? '0 0 30px #4ade80'
                            : animationState === 'wrong'
                                ? '0 0 30px #ef4444'
                                : '0 10px 40px rgba(0,0,0,0.3)',
                        transform: animationState === 'enter' ? 'scale(0.9)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        border: '4px solid #333'
                    }}>
                        <span style={{ fontSize: '6rem', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))' }}>{currentItem.image}</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '1rem', color: '#fff' }}>{currentItem.name}</span>
                        {/* Hint for easier gameplay logic display */}
                        {/* <small style={{ opacity: 0.5 }}>{currentItem.allergens.length > 0 ? 'Has: ' + currentItem.allergens.join(', ') : 'Safe'}</small> */}
                    </div>
                )}

                <div style={{ height: '30px', color: animationState === 'wrong' ? '#ef4444' : animationState === 'correct' ? '#4ade80' : '#aaa', fontWeight: '600', fontSize: '1.1rem' }}>
                    {message}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1.5rem', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                <button
                    onClick={() => handleChoice('trash')}
                    style={{
                        flex: 1,
                        padding: '25px',
                        borderRadius: '24px',
                        border: 'none',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transform: 'scale(1)',
                        transition: 'transform 0.1s',
                        boxShadow: '0 4px 0 #fca5a5'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Trash2 size={36} />
                    <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>TRASH IT</span>
                </button>

                <button
                    onClick={() => handleChoice('eat')}
                    style={{
                        flex: 1,
                        padding: '25px',
                        borderRadius: '24px',
                        border: 'none',
                        backgroundColor: '#dcfce7',
                        color: '#22c55e',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transform: 'scale(1)',
                        transition: 'transform 0.1s',
                        boxShadow: '0 4px 0 #86efac'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Utensils size={36} />
                    <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>EAT IT</span>
                </button>
            </div>

            {/* CSS Animations */}
            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                    @keyframes bounceIn {
                        0% { transform: scale(0); }
                        60% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                    @keyframes shake {
                        0% { transform: translateX(0); }
                        25% { transform: translateX(-10px); }
                        50% { transform: translateX(10px); }
                        75% { transform: translateX(-10px); }
                        100% { transform: translateX(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default HeroGame;