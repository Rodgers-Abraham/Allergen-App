import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Trash2, Utensils } from 'lucide-react';

const FOOD_ITEMS = [
    { name: "Peanut Butter", image: "🥜", allergens: ["Peanuts"] },
    { name: "Apple", image: "🍎", allergens: [] },
    { name: "Milkshake", image: "🥤", allergens: ["Milk"] },
    { name: "Bread", image: "🍞", allergens: ["Wheat"] },
    { name: "Fish Sticks", image: "🐟", allergens: ["Fish"] },
    { name: "Broccoli", image: "🥦", allergens: [] },
    { name: "Cheese", image: "🧀", allergens: ["Milk"] },
    { name: "Egg", image: "🥚", allergens: ["Eggs"] }
];

const HeroGame = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [currentItem, setCurrentItem] = useState(null);
    const [message, setMessage] = useState("Is this safe for you?");
    const [userAllergens, setUserAllergens] = useState([]);

    useEffect(() => {
        // Load high score
        const savedHigh = localStorage.getItem('heroHighScore');
        if (savedHigh) setHighScore(parseInt(savedHigh));

        // Load user allergens (Mocking for now if not in storage, or fetching from storage)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserAllergens(user.allergens || []);
        } else {
            // Default for demo if no user
            setUserAllergens(["Peanuts", "Milk"]);
        }

        nextRound();
    }, []);

    const nextRound = () => {
        const randomItem = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
        setCurrentItem(randomItem);
        setMessage("Is this safe for you?");
    };

    const handleChoice = (action) => {
        if (!currentItem) return;

        const isAllergic = currentItem.allergens.some(a => userAllergens.includes(a));
        let isCorrect = false;

        if (action === 'eat') {
            isCorrect = !isAllergic;
        } else if (action === 'trash') {
            isCorrect = isAllergic;
        }

        if (isCorrect) {
            const newScore = score + 10;
            setScore(newScore);
            setMessage("Correct! +10 Points");
            if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('heroHighScore', newScore);
            }
            setTimeout(nextRound, 1000);
        } else {
            setMessage("Oops! Wrong choice.");
            setScore(0); // Reset score on wrong answer? Or just penalty? Let's reset for challenge.
            setTimeout(nextRound, 1500);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--color-text)' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Allergy Hero</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {highScore >= 100 && <Shield size={24} color="gold" fill="gold" />}
                    <span style={{ fontWeight: 'bold' }}>High: {highScore}</span>
                </div>
            </div>

            {/* Game Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                    Score: {score}
                </div>

                {currentItem && (
                    <div style={{
                        width: '200px',
                        height: '200px',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <span style={{ fontSize: '5rem' }}>{currentItem.image}</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>{currentItem.name}</span>
                    </div>
                )}

                <div style={{ height: '24px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                    {message}
                </div>

                <div style={{ display: 'flex', gap: '2rem', width: '100%', maxWidth: '400px', justifyContent: 'center' }}>
                    <button
                        onClick={() => handleChoice('trash')}
                        style={{
                            flex: 1,
                            padding: '20px',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: '#ffcdd2',
                            color: '#c62828',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'transform 0.1s'
                        }}
                    >
                        <Trash2 size={32} />
                        <span style={{ fontWeight: 'bold' }}>Trash It</span>
                    </button>

                    <button
                        onClick={() => handleChoice('eat')}
                        style={{
                            flex: 1,
                            padding: '20px',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: '#c8e6c9',
                            color: '#2e7d32',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'transform 0.1s'
                        }}
                    >
                        <Utensils size={32} />
                        <span style={{ fontWeight: 'bold' }}>Eat It</span>
                    </button>
                </div>
            </div>

            <style>
                {`
                    @keyframes popIn {
                        from { transform: scale(0.5); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default HeroGame;
