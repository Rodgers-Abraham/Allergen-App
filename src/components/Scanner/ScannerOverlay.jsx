import React from 'react';

const ScannerOverlay = ({ status }) => {
    // status: 'scanning' | 'analyzing' | 'safe' | 'danger' | 'unknown'

    const getBorderColor = () => {
        switch (status) {
            case 'danger': return 'var(--color-danger)';
            case 'safe': return 'var(--color-success)';
            case 'unknown': return 'var(--color-secondary)';
            default: return 'rgba(255, 255, 255, 0.5)';
        }
    };

    const isPulse = status === 'analyzing' || status === 'danger';

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: 'none', // Let clicks pass through
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5
        }}>
            {/* Target Box */}
            <div style={{
                width: '70%',
                height: '40%',
                border: `4px solid ${getBorderColor()}`,
                borderRadius: '20px',
                boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5)`, // Dim background outside box
                position: 'relative',
                transition: 'border-color 0.3s ease',
                animation: isPulse ? 'pulse 1.5s infinite' : 'none'
            }}>
                {/* Corner Markers for high-tech feel */}
                <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '20px', height: '20px', borderTop: '4px solid white', borderLeft: '4px solid white', borderRadius: '4px 0 0 0' }}></div>
                <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', borderTop: '4px solid white', borderRight: '4px solid white', borderRadius: '0 4px 0 0' }}></div>
                <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '20px', height: '20px', borderBottom: '4px solid white', borderLeft: '4px solid white', borderRadius: '0 0 0 4px' }}></div>
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderBottom: '4px solid white', borderRight: '4px solid white', borderRadius: '0 0 4px 0' }}></div>

                {status === 'analyzing' && (
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '0', right: '0',
                        height: '2px',
                        background: 'var(--color-primary)',
                        boxShadow: '0 0 4px var(--color-primary)',
                        animation: 'scan-line 2s linear infinite'
                    }}></div>
                )}
            </div>

            <style>
                {`
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
                        70% { box-shadow: 0 0 0 20px rgba(255, 0, 0, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
                    }
                    @keyframes scan-line {
                        0% { top: 0%; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                `}
            </style>
        </div>
    );
};

export default ScannerOverlay;
