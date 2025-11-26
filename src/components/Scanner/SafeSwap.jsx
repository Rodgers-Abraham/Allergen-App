import React from 'react';
import { CheckCircle } from 'lucide-react';

const SafeSwap = ({ alternatives }) => {
    if (!alternatives || alternatives.length === 0) return null;

    return (
        <div style={{
            marginTop: '15px',
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '12px',
            padding: '15px',
            color: '#155724',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <CheckCircle size={20} />
                <h4 style={{ margin: 0 }}>Try these instead:</h4>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {alternatives.map((alt, index) => (
                    <span key={index} style={{
                        background: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        border: '1px solid #b1dfbb'
                    }}>
                        {alt}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SafeSwap;