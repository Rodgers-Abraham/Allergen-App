import React, { useState, useRef } from 'react';
import { PhoneCall } from 'lucide-react';

const SOSButton = () => {
    const [pressing, setPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);
    const intervalRef = useRef(null);

    const handleStart = (e) => {
        e.preventDefault(); // Prevent context menu on mobile
        setPressing(true);
        setProgress(0);

        const startTime = Date.now();
        const duration = 3000; // 3 seconds

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);
        }, 50);

        timerRef.current = setTimeout(() => {
            triggerSOS();
            reset();
        }, duration);
    };

    const handleEnd = () => {
        if (pressing) {
            reset();
        }
    };

    const reset = () => {
        setPressing(false);
        setProgress(0);
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    const triggerSOS = () => {
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);

        // Get location if possible
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    sendSMS(mapsLink);
                },
                (error) => {
                    console.error("Location error", error);
                    sendSMS("Location unavailable");
                }
            );
        } else {
            sendSMS("Location unavailable");
        }
    };

    const sendSMS = (locationInfo) => {
        const message = `HELP! Allergic reaction detected. My location: ${locationInfo}`;
        // Use a dummy number or prompt user to configure
        const phoneNumber = "1234567890";
        window.open(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '80px', // Above bottom nav if exists, or just bottom right
                right: '20px',
                zIndex: 1000,
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
        >
            {/* Progress Ring */}
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: -10, left: -10, pointerEvents: 'none' }}>
                <circle
                    cx="40" cy="40" r="38"
                    stroke="rgba(255,0,0,0.2)"
                    strokeWidth="4"
                    fill="none"
                />
                <circle
                    cx="40" cy="40" r="38"
                    stroke="red"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="239" // 2 * pi * 38
                    strokeDashoffset={239 - (239 * progress) / 100}
                    style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                />
            </svg>

            <button
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: pressing ? '#b71c1c' : '#f44336',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
                    cursor: 'pointer',
                    transform: pressing ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                }}
            >
                <PhoneCall size={28} />
            </button>

            {pressing && (
                <div style={{
                    position: 'absolute',
                    bottom: '70px',
                    right: '0',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap'
                }}>
                    Hold for SOS
                </div>
            )}
        </div>
    );
};

export default SOSButton;
