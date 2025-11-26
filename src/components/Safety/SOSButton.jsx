import React, { useState } from 'react';
import { Phone, AlertTriangle, X } from 'lucide-react';

const SOSButton = () => {
    const [showEmergencyCard, setShowEmergencyCard] = useState(false);
    const [userData, setUserData] = useState(null); // Store data for the card

    const handleSOSClick = () => {
        // 1. FORCE READ: Read directly from disk to get the freshest data
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData(currentUser); // Save for the visual card

        console.log("SOS Triggered. Data found:", currentUser); // Debug check

        // 2. CHECK: Do we have a phone number?
        if (!currentUser.emergencyContactPhone) {
            alert("⚠️ Please add an Emergency Contact in your Profile first!");
            // Optional: Redirect them to profile automatically?
            // window.location.href = '/profile'; 
            return;
        }

        // 3. VIBRATE: Tactile Feedback
        if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);

        // 4. SMS LOGIC
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                const mapsLink = `http://maps.google.com/?q=${lat},${long}`;

                const message = `SOS! I am having an allergic reaction. Please help! My location: ${mapsLink}`;
                window.open(`sms:${currentUser.emergencyContactPhone}?body=${encodeURIComponent(message)}`, '_blank');
            }, () => {
                // Fallback if GPS blocked
                const message = "SOS! I am having an allergic reaction. Please help!";
                window.open(`sms:${currentUser.emergencyContactPhone}?body=${encodeURIComponent(message)}`, '_blank');
            });
        } else {
            const message = "SOS! I am having an allergic reaction. Please help!";
            window.open(`sms:${currentUser.emergencyContactPhone}?body=${encodeURIComponent(message)}`, '_blank');
        }

        // 5. SHOW CARD
        setShowEmergencyCard(true);
    };

    return (
        <>
            {/* The Floating Button */}
            <button
                onClick={handleSOSClick}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#dc2626', // Red
                    color: 'white',
                    border: '4px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 90,
                    animation: 'pulse-red 2s infinite'
                }}
            >
                <Phone size={28} />
                <style>{`
                    @keyframes pulse-red {
                        0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
                        70% { box-shadow: 0 0 0 20px rgba(220, 38, 38, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
                    }
                `}</style>
            </button>

            {/* The Full Screen Emergency Card */}
            {showEmergencyCard && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: '#dc2626',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '20px',
                    boxSizing: 'border-box'
                }}>
                    <button
                        onClick={() => setShowEmergencyCard(false)}
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        <X size={40} />
                    </button>

                    <AlertTriangle size={80} style={{ marginBottom: '20px', animation: 'shake 0.5s infinite' }} />

                    <h1 style={{ fontSize: '3rem', margin: 0, textAlign: 'center' }}>HELP!</h1>
                    <h2 style={{ fontSize: '1.5rem', opacity: 0.9, textAlign: 'center' }}>ALLERGIC REACTION</h2>

                    <div style={{ background: 'white', color: '#333', padding: '20px', borderRadius: '16px', width: '100%', marginTop: '30px' }}>
                        {/* Display the data we captured on click */}
                        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#666' }}>NAME</label>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{userData?.fullName || 'Unknown'}</div>
                        </div>
                        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#666' }}>ALLERGIES</label>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#dc2626' }}>
                                {userData?.allergens?.join(', ') || 'None Listed'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>BLOOD</label>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{userData?.bloodType || 'N/A'}</div>
                            </div>
                            {userData?.hasEpiPen && (
                                <div style={{ background: '#dcfce7', padding: '5px 10px', borderRadius: '8px', color: '#166534', fontWeight: 'bold' }}>
                                    💉 HAS EPIPEN
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SOSButton;