import React from 'react';

const ScannerOverlay = ({ status = 'scanning' }) => {
    // status: 'scanning' | 'analyzing' | 'safe' | 'danger' | 'caution'

    // 1. Determine Visuals based on Status
    let color = '#ffffff'; // Default White for Scanning
    let text = 'Scanning...';
    let showLaser = true;

    if (status === 'analyzing') {
        color = '#3b82f6'; // Bright Blue
        text = 'Analyzing...';
        showLaser = true;
    } else if (status === 'danger') {
        color = '#ef4444'; // Bright Red
        text = '⚠️ UNSAFE';
        showLaser = false;
    } else if (status === 'caution') {
        color = '#f59e0b'; // Orange
        text = '⚠️ CAUTION';
        showLaser = false;
    } else if (status === 'safe') {
        color = '#22c55e'; // Bright Green
        text = '✅ SAFE';
        showLaser = false;
    }

    return (
        <div style={styles.container}>
            {/* Darken the background OUTSIDE the target box to focus attention */}
            <div style={styles.dimmedBackground}></div>

            {/* The Active Scanner Box */}
            <div style={{
                ...styles.box,
                borderColor: color,
                boxShadow: `0 0 20px ${color}80` // Glow effect
            }}>

                {/* Tech Corners (The "HUD" look) */}
                <div style={{ ...styles.corner, ...styles.topLeft, borderTopColor: color, borderLeftColor: color }} />
                <div style={{ ...styles.corner, ...styles.topRight, borderTopColor: color, borderRightColor: color }} />
                <div style={{ ...styles.corner, ...styles.bottomLeft, borderBottomColor: color, borderLeftColor: color }} />
                <div style={{ ...styles.corner, ...styles.bottomRight, borderBottomColor: color, borderRightColor: color }} />

                {/* The Moving Laser Beam */}
                {showLaser && (
                    <div style={{
                        ...styles.scanLine,
                        background: `linear-gradient(to right, transparent, ${color}, transparent)`
                    }}>
                        {/* The "Hot" center of the laser */}
                        <div style={{ ...styles.scanLight, backgroundColor: color }} />
                    </div>
                )}
            </div>

            {/* Status Label Badge */}
            <div style={{
                ...styles.label,
                backgroundColor: color,
                // Shake animation if danger
                animation: status === 'danger' ? 'shake 0.5s ease-in-out' : 'none'
            }}>
                {text}
            </div>

            {/* CSS Animations */}
            <style>
                {`
                    @keyframes scanMove {
                        0% { top: 0%; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        75% { transform: translateX(5px); }
                    }
                `}
            </style>
        </div>
    );
};

// Styles Object for cleaner code
const styles = {
    container: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', // Lets clicks pass through to the camera
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    // Creates the "Focus" effect by dimming the rest of the screen slightly
    dimmedBackground: {
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
        zIndex: -1
    },
    box: {
        width: '75%',
        maxWidth: '300px',
        aspectRatio: '1/1', // Keeps it square
        position: 'relative',
        borderRadius: '20px',
        border: '2px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease'
    },
    corner: {
        position: 'absolute',
        width: '20px',
        height: '20px',
        borderWidth: '4px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderRadius: '4px'
    },
    topLeft: { top: '-2px', left: '-2px', borderTopLeftRadius: '12px' },
    topRight: { top: '-2px', right: '-2px', borderTopRightRadius: '12px' },
    bottomLeft: { bottom: '-2px', left: '-2px', borderBottomLeftRadius: '12px' },
    bottomRight: { bottom: '-2px', right: '-2px', borderBottomRightRadius: '12px' },

    scanLine: {
        position: 'absolute',
        width: '100%',
        height: '4px', // Thicker beam
        animation: 'scanMove 2s infinite linear',
        boxShadow: '0 0 10px currentColor'
    },
    scanLight: {
        width: '100%',
        height: '100%',
        boxShadow: '0 0 15px 4px currentColor' // Glowing center
    },
    label: {
        marginTop: '30px',
        padding: '10px 24px',
        borderRadius: '50px',
        color: 'white',
        fontWeight: '900',
        fontSize: '1.2rem',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
};

export default ScannerOverlay;