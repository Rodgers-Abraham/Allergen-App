import React from 'react';
import { getSafeSwaps } from '../../lib/safeSwapData';
import { ThumbsUp } from 'lucide-react';

const SafeSwapList = ({ allergens }) => {
    // allergens is an array of strings, e.g., ["Peanuts", "Milk"]

    // Flatten all swaps for all detected allergens
    const allSwaps = allergens.flatMap(allergen => {
        const swaps = getSafeSwaps(allergen);
        return swaps.map(swap => ({ ...swap, for: allergen }));
    });

    if (allSwaps.length === 0) return null;

    return (
        <div style={{ marginTop: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ThumbsUp size={18} color="var(--color-success)" />
                <h4 style={{ margin: 0, color: 'var(--color-text)' }}>Safe Swaps</h4>
            </div>

            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '12px',
                paddingBottom: '8px',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none' // IE/Edge
            }}>
                <style>
                    {`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>

                {allSwaps.map((swap, index) => (
                    <div key={index} style={{
                        minWidth: '100px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-success)',
                        borderRadius: '12px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{swap.image}</span>
                        <span style={{ fontSize: '0.8em', fontWeight: 'bold', color: 'var(--color-text)' }}>{swap.name}</span>
                        <span style={{ fontSize: '0.6em', color: '#666' }}>No {swap.for}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SafeSwapList;
