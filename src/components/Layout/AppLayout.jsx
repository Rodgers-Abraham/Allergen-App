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
        </div>
    );
};

export default AppLayout;
