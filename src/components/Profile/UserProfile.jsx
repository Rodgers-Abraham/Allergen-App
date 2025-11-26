import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Activity, AlertCircle, LogOut, Trash2 } from 'lucide-react';
import { logoutUser } from '../../lib/storage';

const UserProfile = () => {
    const navigate = useNavigate();

    // Default Empty State
    const [formData, setFormData] = useState({
        fullName: '',
        nickname: '',
        email: '',
        phoneNumber: '',
        bloodType: '',
        hasEpiPen: false,
        emergencyContactName: '',
        emergencyContactPhone: '',
        allergens: []
    });
    const [message, setMessage] = useState('');

    // --- 1. FORCE LOAD DATA ON MOUNT ---
    useEffect(() => {
        try {
            // Read raw string directly from browser memory
            const rawData = localStorage.getItem('user');

            if (rawData) {
                const parsedData = JSON.parse(rawData);
                console.log("📥 LOADED FROM STORAGE:", parsedData); // Check your console!

                // Merge: Use saved data, fall back to current defaults if missing
                setFormData(prev => ({
                    ...prev,
                    ...parsedData,
                    // Ensure booleans are actually booleans
                    hasEpiPen: parsedData.hasEpiPen === true || parsedData.hasEpiPen === "true"
                }));
            }
        } catch (err) {
            console.error("Load Error:", err);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- 2. DIRECT SAVE ---
    const handleSave = (e) => {
        e.preventDefault();
        try {
            // Get what's currently on disk (to keep ID/Password safe)
            const currentDiskData = JSON.parse(localStorage.getItem('user') || '{}');

            // Merge it with our form data
            const newData = {
                ...currentDiskData,
                ...formData
            };

            // Write back to disk
            localStorage.setItem('user', JSON.stringify(newData));
            console.log("💾 SAVED TO STORAGE:", newData); // Check console!

            setMessage("Profile Saved Successfully! ✅");

            // Force a small delay so user sees the message
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Save Error:", error);
            setMessage("Error saving. Check console.");
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure? This cannot be undone.")) {
            localStorage.clear(); // Wipe everything
            navigate('/');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', paddingBottom: '40px' }}>

            {/* Header */}
            <div style={{ padding: '20px', background: 'white', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ margin: 0 }}>My Profile</h2>
            </div>

            <form onSubmit={handleSave} style={{ maxWidth: '600px', margin: '20px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {message && <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>{message}</div>}

                {/* EMERGENCY CONTACT */}
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}><AlertCircle size={20} /> Next of Kin (SOS)</h3>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Contact Name</label>
                        <input
                            type="text"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                            placeholder="e.g. Mom"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Contact Phone</label>
                        <input
                            type="tel"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            style={styles.input}
                        />
                    </div>
                </div>

                {/* MEDICAL ID */}
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}><Activity size={20} /> Medical Details</h3>
                    <div style={{ ...styles.inputGroup, flex: 1 }}>
                        <label style={styles.label}>Blood Type</label>
                        <select name="bloodType" value={formData.bloodType} onChange={handleChange} style={styles.input}>
                            <option value="">Select...</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                    <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#fff3cd', borderRadius: '8px' }}>
                        <input
                            type="checkbox"
                            id="epipen"
                            name="hasEpiPen"
                            checked={formData.hasEpiPen}
                            onChange={handleChange}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <label htmlFor="epipen" style={{ fontWeight: 'bold', color: '#856404' }}>I carry an EpiPen</label>
                    </div>
                </div>

                {/* PERSONAL INFO */}
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}><User size={20} /> Personal Info</h3>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={styles.input} />
                    </div>

                    {/* READ-ONLY ALLERGENS (Reminder) */}
                    <div style={{ marginTop: '15px' }}>
                        <label style={styles.label}>My Allergies (Set during Signup)</label>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {formData.allergens && formData.allergens.length > 0 ? (
                                formData.allergens.map((alg, i) => (
                                    <span key={i} style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>{alg}</span>
                                ))
                            ) : (
                                <span style={{ color: '#999', fontSize: '0.9rem' }}>No allergies listed.</span>
                            )}
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-primary" style={styles.saveBtn}>
                    <Save size={20} /> Save Profile
                </button>

                {/* DANGER ZONE */}
                <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                    <button type="button" onClick={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={20} /> Log Out
                    </button>
                    <button type="button" onClick={handleDeleteAccount} style={styles.deleteBtn}>
                        <Trash2 size={20} /> Delete Account
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    card: { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    sectionTitle: { margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#333', fontSize: '1.1rem' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
    saveBtn: { padding: '15px', borderRadius: '12px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#28a745', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)', width: '100%' },
    logoutBtn: { width: '100%', padding: '15px', borderRadius: '12px', fontSize: '1rem', background: '#e5e7eb', color: '#374151', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px', fontWeight: '600' },
    deleteBtn: { width: '100%', padding: '15px', borderRadius: '12px', fontSize: '1rem', background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '600' }
};

export default UserProfile;