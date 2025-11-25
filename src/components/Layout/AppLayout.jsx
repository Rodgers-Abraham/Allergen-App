import React from 'react';
import { Outlet } from 'react-router-dom';
import SOSButton from '../Safety/SOSButton';

const AppLayout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ flex: 1, paddingBottom: '80px' }}>
                <Outlet />
            </div>
            <SOSButton />
            <footer style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'var(--color-bg)',
                color: 'var(--color-text-muted)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                width: '100%',
                marginTop: 'auto'
            }}>
                BUILT BY BLACK PUPPY
            </footer>
        </div>
    );
};

export default AppLayout;
