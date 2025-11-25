import React from 'react';
import Character from '../Dashboard/Character';
import SafeSwapList from '../Scanner/SafeSwapList';
import { X } from 'lucide-react';

const WarningPopup = ({ result, onClose }) => {
    const { status, message, product } = result;

    const getBgColor = () => {
        switch (status) {
            case 'danger': return 'var(--color-danger)';
            case 'unknown': return 'var(--color-secondary)';
            default: return 'var(--color-primary)';
        }
    };

    const getTitle = () => {
        switch (status) {
            case 'danger': return 'DANGER DETECTED';
            case 'unknown': return 'Unknown Product';
            default: return 'SAFE TO CONSUME';
        }
    };

    const getCharacterStatus = () => {
        switch (status) {
            case 'danger': return 'alert';
            case 'unknown': return 'concerned';
            default: return 'happy';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '24px',
                padding: '2rem',
                width: '100%',
                maxWidth: '350px',
                textAlign: 'center',
                position: 'relative',
                border: `4px solid ${getBgColor()}`
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text)'
                    }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ color: getBgColor(), marginTop: 0 }}>{getTitle()}</h2>

                <Character status={getCharacterStatus()} />

                <h3 style={{ margin: '1rem 0' }}>{product ? product.name : 'Unknown Item'}</h3>

                <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{message}</p>

                {status === 'danger' && (
                    <>
                        <div style={{ marginTop: '1rem', padding: '10px', background: '#ffebee', borderRadius: '8px', color: '#c62828' }}>
                            <strong>Action Required:</strong><br />
                            Do not consume. Find an alternative.
                        </div>
                        <SafeSwapList allergens={result.detectedAllergens || []} />
                    </>
                )}

                <button
                    onClick={onClose}
                    className="btn-primary"
                    style={{
                        marginTop: '2rem',
                        width: '100%',
                        backgroundColor: getBgColor()
                    }}
                >
                    {status === 'danger' ? 'I Understand' : 'Continue'}
                </button>
            </div>
        </div>
    );
};

export default WarningPopup;
