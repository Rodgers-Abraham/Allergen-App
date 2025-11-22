import React from 'react';

const Character = ({ status }) => {
    // status: 'happy' | 'concerned' | 'alert'

    const getColor = () => {
        switch (status) {
            case 'alert': return 'var(--color-danger)';
            case 'concerned': return 'var(--color-secondary)';
            default: return 'var(--color-primary)';
        }
    };

    return (
        <div style={{
            width: '150px',
            height: '150px',
            margin: '0 auto',
            position: 'relative',
            transition: 'all 0.3s ease'
        }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                {/* Body */}
                <circle cx="50" cy="50" r="45" fill={getColor()} />

                {/* Eyes */}
                <circle cx="35" cy="40" r="5" fill="white" />
                <circle cx="65" cy="40" r="5" fill="white" />

                {/* Mouth */}
                {status === 'happy' && (
                    <path d="M 30 60 Q 50 80 70 60" stroke="white" strokeWidth="3" fill="none" />
                )}
                {status === 'concerned' && (
                    <line x1="30" y1="65" x2="70" y2="65" stroke="white" strokeWidth="3" />
                )}
                {status === 'alert' && (
                    <circle cx="50" cy="65" r="10" fill="white" />
                )}
            </svg>
        </div>
    );
};

export default Character;
